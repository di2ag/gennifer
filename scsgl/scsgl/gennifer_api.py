import os
import pandas as pd
from pathlib import Path
import numpy as np
import shutil
import uuid

from .zenodo import load_file

def generateInputs(zenodo_id):
    '''
    Function to generate desired inputs for scSGL.

    '''
    os.makedirs("/tmp/", exist_ok=True) # Create the /tmp/ directory if it doesn't exist
    uniqueID = str(uuid.uuid4())
    tempUniqueDirPath = "/tmp/" + uniqueID+'/SCSGL' 
    os.makedirs(tempUniqueDirPath, exist_ok=True)
    
    ExpressionData = load_file(zenodo_id, 'ExpressionData.csv')
    # Load refnetwork data
    refNetworkData = load_file(zenodo_id, 'refNetwork.csv')
        
    # Write gene expression data in SCSGL folder 
    ExpressionData.to_csv(tempUniqueDirPath + '/ExpressionData.csv', sep = ',', header  = True)

	  # Write reference network data in SCSGL folder 
    refNetworkData.to_csv(tempUniqueDirPath + '/refNetworkData.csv', sep = ',', header  = True)    

    return tempUniqueDirPath
    
def run(tempUniqueDirPath,pos_density, neg_density, assoc):
    '''
    Function to run scSGL algorithm

    '''

    # Get path for ExpressionData.csv generated in SCSGL folder for certain type of network in inputs
    expressionDataPath = os.path.join(tempUniqueDirPath, "ExpressionData.csv")

    # Get path for refNetwor.csv generated in SCSGL folder for certain type of network in inputs
    refNetworkPath = os.path.join(tempUniqueDirPath, 'refNetworkData.csv')

    # make output dirs if they do not exist:
    outDir = os.path.join(tempUniqueDirPath, "outputs")
    os.makedirs(outDir, exist_ok = True)

    outPath = os.path.join(outDir, 'outFile.txt')
    cmdToRun = ' '.join(['python3 run_scSGL.py',
                         '--expression_file='+expressionDataPath, '--ref_net_file='+refNetworkPath, '--out_file='+outPath, 
                         '--pos_density='+str(pos_density), '--neg_density='+str(neg_density), '--assoc='+assoc])

    print(cmdToRun)
    os.system(cmdToRun)
    return tempUniqueDirPath

def parseOutput(tempUniqueDirPath):
    '''
    Function to parse outputs from SCSGL.

    '''
    
    outDir = outDir = os.path.join(tempUniqueDirPath,  "outputs")
    OutDF = pd.read_csv(outDir+'/outFile.txt', sep = '\t', header = 0)

    OutDF.sort_values(by="EdgeWeight", ascending=False, inplace=True)
    
    if not Path(outDir+'/outFile.txt').exists():
        print(outDir+'outFile.txt'+'does not exist, skipping...')
        return
    
    
    results = {'Gene1': [], 
               'Gene2': [],
               'EdgeWeight': []}

    for idx, row in OutDF.iterrows():
        results['Gene1'].append(row[0])
        results['Gene2'].append(row[1])
        results['EdgeWeight'].append(str(row[2]))

    shutil.rmtree(tempUniqueDirPath)
    
    return results
