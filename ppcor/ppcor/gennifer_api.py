import os
import pandas as pd
from pathlib import Path
import numpy as np
import shutil
import uuid

from .zenodo import load_file

def generateInputs(zenodo_id):
    '''
    Function to generate desired inputs for PPCOR.

    '''
    os.makedirs("/tmp/", exist_ok=True) # Create the /tmp/ directory if it doesn't exist
    uniqueID = str(uuid.uuid4())
    tempUniqueDirPath = "/tmp/" + uniqueID+'/PPCOR' 
    os.makedirs(tempUniqueDirPath, exist_ok=True)
    
    ExpressionData = load_file(zenodo_id, 'ExpressionData.csv')
        
    # Write gene expression data in PPCOR folder 
    ExpressionData.to_csv(tempUniqueDirPath + '/ExpressionData.csv', sep = ',', header  = True)


    return tempUniqueDirPath
    
def run(tempUniqueDirPath):
    '''
    Function to run PPCOR algorithm

    '''
    inputPath = os.path.join(tempUniqueDirPath, "ExpressionData.csv")

    # make output dirs if they do not exist:
    outDir = os.path.join(tempUniqueDirPath, "outputs")
    os.makedirs(outDir, exist_ok = True)

    outPath = os.path.join(outDir, 'outFile.txt')
    cmdToRun = ' '.join(['Rscript ppcor/runPPCOR.R', inputPath, outPath])

    print(cmdToRun)
    os.system(cmdToRun)
    return tempUniqueDirPath

def parseOutput(tempUniqueDirPath, pVal):
    '''
    Function to parse outputs from PPCOR.

    '''
    
    outDir = outDir = os.path.join(tempUniqueDirPath,  "outputs")
    OutDF = pd.read_csv(outDir+'/outFile.txt', sep = '\t', header = 0)
    part1 = OutDF.loc[OutDF['pValue'] <= pVal]
    part1 = part1.assign(absCorVal = part1['corVal'].abs())

    results = {'Gene1': [], 
               'Gene2': [],
               'EdgeWeight': []}

    for idx, row in part1.sort_values('absCorVal', ascending = False).iterrows():
        results['Gene1'].append(row[0])
        results['Gene2'].append(row[1])
        results['EdgeWeight'].append(str(row['corVal']))

    shutil.rmtree(tempUniqueDirPath)
    
    return results
