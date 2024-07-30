import os
import pandas as pd
from pathlib import Path
import numpy as np
import shutil
import uuid

from .zenodo import load_file

def generateInputs(zenodo_id, nBins):
    '''
    Function to generate desired inputs for SINCERITIES.

    '''
    os.makedirs("/tmp/", exist_ok=True) # Create the /tmp/ directory if it doesn't exist
    uniqueID = str(uuid.uuid4())
    tempUniqueDirPath = "/tmp/" + uniqueID+'/SINCERITIES' 
    os.makedirs(tempUniqueDirPath, exist_ok=True)
    
    ExpressionData = load_file(zenodo_id, 'ExpressionData.csv')
    # Load psuedotime data
    PTData = load_file(zenodo_id, 'PseudoTime.csv')

    colNames = PTData.columns
    for idx in range(len(colNames)):
        # Select cells belonging to each pseudotime trajectory
        colName = colNames[idx]
        index = PTData[colName].index[PTData[colName].notnull()]
        exprName = "ExpressionData"+str(idx)+".csv"
        newExpressionData = ExpressionData.loc[:,index].T
        # Perform quantile binning as recommeded in the paper
        # http://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.qcut.html#pandas.qcut
        tQuantiles = pd.qcut(PTData.loc[index,colName], q = nBins, duplicates ='drop')
        mid = [(a.left + a.right)/2 for a in tQuantiles]

        newExpressionData['Time'] = mid
        newExpressionData.to_csv(os.path.join(tempUniqueDirPath, exprName),
                             sep = ',', header  = True, index = False)
    return tempUniqueDirPath, PTData
    
def run(tempUniqueDirPath, PTData):
    '''
    Function to run SINCERITIES algorithm

    '''
    inputPath = os.path.join(tempUniqueDirPath)
    # make output dirs if they do not exist:
    outDir = os.path.join(tempUniqueDirPath, "outputs")
    os.makedirs(outDir, exist_ok = True)


    colNames = PTData.columns
    for idx in range(len(colNames)):
        inFile = "/ExpressionData"+str(idx)+".csv"
        outPath = outDir + '/outFile'+str(idx)+'.txt'
        cmdToRun = ' '.join(['Rscript sincerities/MAIN.R',
                             inputPath+inFile, outPath])
        print(cmdToRun)
        os.system(cmdToRun)

    return tempUniqueDirPath

def parseOutput(tempUniqueDirPath, PTData):
    '''
    Function to parse outputs from SINCERITIES.

    '''
    outDir = os.path.join(tempUniqueDirPath, "outputs")

    colNames = PTData.columns
    OutSubDF = [0]*len(colNames)
    for idx in range(len(colNames)):
        # Read output
        outFile = '/outFile'+str(idx)+'.txt'
        if not Path(outDir+outFile).exists():
            # Quit if output file does not exist

            print(outDir+outFile+' does not exist, skipping...')
            return
        OutSubDF[idx] = pd.read_csv(outDir+outFile, sep = ',', header = 0)

    # megre the dataframe by taking the maximum value from each DF
    # From here: https://stackoverflow.com/questions/20383647/pandas-selecting-by-label-sometimes-return-series-sometimes-returns-dataframe
    outDF = pd.concat(OutSubDF)
    # Group by rows code is from here:
    # https://stackoverflow.com/questions/53114609/pandas-how-to-remove-duplicate-rows-but-keep-all-rows-with-max-value
    res = outDF[outDF['Interaction'] == outDF.groupby(['SourceGENES','TargetGENES'])['Interaction'].transform('max')]
    # Sort values in the dataframe   
    finalDF = res.sort_values('Interaction',ascending=False)
    finalDF.drop(labels = 'Edges',axis = 'columns', inplace = True)
    # SINCERITIES output is incorrectly orderd
    finalDF.columns = ['Gene2','Gene1','EdgeWeight']
    #finalDF.to_csv(outDir+'rankedEdges.csv',sep='\t', columns = ['Gene1','Gene2','EdgeWeight'],index = False)
    finalDF.sort_values(['EdgeWeight'], ascending = False, inplace = True)
    
    results = {'Gene1': [], 
               'Gene2': [],
               'EdgeWeight': []}

    for idx, row in finalDF.iterrows():
        results['Gene1'].append(row[0])
        results['Gene2'].append(row[1])
        results['EdgeWeight'].append(str(row[2]))

    shutil.rmtree(tempUniqueDirPath)
    
    return results
