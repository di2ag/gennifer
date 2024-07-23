import os
import pandas as pd
from pathlib import Path
import numpy as np
import shutil
import uuid

from .zenodo import load_file

def generateInputs(zenodo_id):
    '''
    Function to generate desired inputs for LEAP.
    '''
    os.makedirs("/tmp/", exist_ok=True) # Create the /tmp/ directory if it doesn't exist
    uniqueID = str(uuid.uuid4())
    tempUniqueDirPath = "/tmp/" + uniqueID+'/LEAP/' 
    os.makedirs(tempUniqueDirPath, exist_ok=True)
    
    inputPath = os.path.join(tempUniqueDirPath,"data")
    os.makedirs(inputPath, exist_ok=True)

    ExpressionData = load_file(zenodo_id, 'ExpressionData.csv')
    # Load psuedotime data
    PTData = load_file(zenodo_id, 'PseudoTime.csv')

    colNames = PTData.columns
    for idx in range(len(colNames)):
        # Select cells belonging to each pseudotime trajectory
        colName = colNames[idx]
        index = PTData[colName].index[PTData[colName].notnull()]
        exprName = "ExpressionData"+str(idx)+".csv"
        
        subPT = PTData.loc[index,:]
        subExpr = ExpressionData[index]
        # Order columns by PseudoTime
        newExpressionData = subExpr[subPT.sort_values([colName]).index.astype(str)]
        
        newExpressionData.insert(loc = 0, column = 'GENES', \
                                                     value = newExpressionData.index)
        newExpressionData.to_csv(os.path.join(inputPath, exprName), sep = ',', header=True, index=False)
    return PTData,tempUniqueDirPath

def run(tempUniqueDirPath, maxLag, PTData):
    '''
    Function to run LEAP algorithm
    '''

    inputPath = os.path.join(tempUniqueDirPath,"data")
    
    # make output dirs if they do not exist:
    outDir = tempUniqueDirPath
    colNames = PTData.columns
    for idx in range(len(colNames)):
        exprName = "/ExpressionData"+str(idx)+".csv"
        outPath = os.path.join(outDir, 'data', 'outFile'+str(idx)+'.txt')
       

        cmdToRun = ' '.join(['Rscript runLeap.R',
                             inputPath+exprName, str(maxLag), outPath])
        print(cmdToRun)
        os.system(cmdToRun)
    return tempUniqueDirPath

def parseOutput(tempUniqueDirPath, PTData):
    '''
    Function to parse outputs from LEAP.
    ''' 
    outDir = tempUniqueDirPath


    colNames = PTData.columns
    OutSubDF = [0]*len(colNames)

    for indx in range(len(colNames)):
        outFileName = 'outFile'+str(indx)+'.txt'
        # Quit if output file does not exist
        if not Path(os.path.join(outDir, 'data', outFileName)).exists():
            print(outDir+ 'data/'+outFileName+' does not exist, skipping...')
            return
        
        # Read output
        OutSubDF[indx] = pd.read_csv(os.path.join(outDir, 'data', outFileName), sep = '\t', header = 0)
        OutSubDF[indx].Score = np.abs(OutSubDF[indx].Score)
    outDF = pd.concat(OutSubDF)
    FinalDF = outDF[outDF['Score'] == outDF.groupby(['Gene1','Gene2'])['Score'].transform('max')]

    results = {'Gene1': [], 
               'Gene2': [],
               'EdgeWeight': []}

    for idx, row in FinalDF.iterrows():
        results['Gene1'].append(row[0])
        results['Gene2'].append(row[1])
        results['EdgeWeight'].append(str(row[2]))

    shutil.rmtree(tempUniqueDirPath)
    
    return results