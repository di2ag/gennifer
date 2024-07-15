import os
import pandas as pd
from pathlib import Path
import numpy as np
import shutil
import uuid

from .zenodo import load_file

def generateInputs(zenodo_id):
    '''
    Function to generate desired inputs for SCODE.
    '''
    os.makedirs("/tmp/", exist_ok=True) # Create the /tmp/ directory if it doesn't exist
    uniqueID = str(uuid.uuid4())
    tempUniqueDirPath = "/tmp/" + uniqueID+'/SCODE' 
    os.makedirs(tempUniqueDirPath, exist_ok=True)
    
    ExpressionData = load_file(zenodo_id, 'ExpressionData.csv')
    # Load psuedotime data
    PTData = load_file(zenodo_id, 'PseudoTime.csv')

    ExpressionData.T.to_csv(tempUniqueDirPath + "/ConvertedExpressionData.csv", sep = '\t', header  = True, index = True)
    colNames = PTData.columns
    for idx in range(len(colNames)):
        # Select cells belonging to each pseudotime trajectory
        colName = colNames[idx]
        index = PTData[colName].index[PTData[colName].notnull()]
        exprName = "ExpressionData"+str(idx)+".csv" 
        ExpressionData.loc[:,index].to_csv(
            os.path.join(tempUniqueDirPath, exprName), sep = '\t', header  = False, index = False
            )
        cellName = "PseudoTime"+str(idx)+".csv"
        ptDF = PTData.loc[index,[colName]]        
        # SCODE expects a column labeled PseudoTime.
        ptDF.rename(columns = {colName:'PseudoTime'}, inplace = True)
        # output file
        ptDF.to_csv(os.path.join(tempUniqueDirPath, cellName), sep = '\t', header  = False)
    return tempUniqueDirPath, PTData
    
def run(tempUniqueDirPath, z, nIter, nRep, PTData):
    '''
    Function to run SCODE algorithm
    '''
    outDir = tempUniqueDirPath
    #PTData = pd.read_csv(tempUniqueDirPath+'/PseudoTime.csv', header = 0, index_col = 0)
    colNames = PTData.columns
    

    for idx in range(len(colNames)):
        ExpressionData = pd.read_csv(
            tempUniqueDirPath + "/ExpressionData"+str(idx)+".csv", header = None, index_col = None, sep ='\t'
            )
        nCells = str(ExpressionData.shape[1])
        nGenes = str(ExpressionData.shape[0])

        os.makedirs(os.path.join(outDir, str(idx)), exist_ok = True)
        os.chdir('/app/SCODE') 
        cmdToRun = ' '.join(['ruby run_R.rb',
                            os.path.join(tempUniqueDirPath, 'ExpressionData'+str(idx)+'.csv'), 
                            os.path.join(tempUniqueDirPath, 'PseudoTime'+str(idx)+'.csv'), 
                            os.path.join(outDir, str(idx)),
                             nGenes, str(z), nCells, str(nIter), str(nRep)])
        print(cmdToRun)
        os.system(cmdToRun)

    return tempUniqueDirPath

def parseOutput(tempUniqueDirPath, PTData):
    '''
    Function to parse outputs from SCODE.
    ''' 
    outDir = tempUniqueDirPath
    colNames = PTData.columns

    for indx in range(len(colNames)):
        # Read output
        outFile = str(indx)+'/meanA.txt'
        if not Path(os.path.join(outDir, outFile)).exists():
            # Quit if output file does not exist

            print(os.path.join(outDir, outFile)+' does not exist, skipping...')
            return
        OutDF = pd.read_csv(os.path.join(outDir, outFile), sep = '\t', header = None)



        # Sort values in a matrix using code from:
        # https://stackoverflow.com/questions/21922806/sort-values-of-matrix-in-python
        OutMatrix = np.abs(OutDF.values)
        idx = np.argsort(OutMatrix, axis = None)[::-1]
        rows, cols = np.unravel_index(idx, OutDF.shape)    
        DFSorted = OutMatrix[rows, cols]

        # read input file for list of gene names
        ExpressionData = pd.read_csv(os.path.join(tempUniqueDirPath, 'ConvertedExpressionData.csv'), header = 0, index_col = 0)
        GeneList = list(ExpressionData.index)

        outFile = open(os.path.join(outDir, 'outFile'+str(indx)+'.csv'), 'w')
        outFile.write('Gene1'+'\t'+'Gene2'+'\t'+'EdgeWeight'+'\n')

        for row, col, val in zip(rows, cols, DFSorted):
            outFile.write('\t'.join([GeneList[row],GeneList[col],str(val)])+'\n')
        outFile.close()
        
    OutSubDF = [0]*len(colNames)
    for indx in range(len(colNames)):
        outFile = 'outFile'+str(indx)+'.csv'
        OutSubDF[indx] = pd.read_csv(os.path.join(outDir, outFile), sep = '\t', header = 0)

        OutSubDF[indx].EdgeWeight = np.abs(OutSubDF[indx].EdgeWeight)

    outDF = pd.concat(OutSubDF)
    FinalDF = outDF[outDF['EdgeWeight'] == outDF.groupby(['Gene1','Gene2'])['EdgeWeight'].transform('max')]
    FinalDF.sort_values(['EdgeWeight'], ascending = False, inplace = True)
    
    results = {'Gene1': [], 
               'Gene2': [],
               'EdgeWeight': []}

    for idx, row in FinalDF.iterrows():
        results['Gene1'].append(row[0])
        results['Gene2'].append(row[1])
        results['EdgeWeight'].append(str(row[2]))

    shutil.rmtree(tempUniqueDirPath)
    
    return results
    
