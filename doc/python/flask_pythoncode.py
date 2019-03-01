
#!C:\Users\Vis\AppData\Local\Programs\Python\Python37\python.exe
#import sys
import numpy as np
#import scipy.linalg as SL
import scipy.sparse
from sparsesvd import sparsesvd
from scipy.sparse.linalg import svds
from flask import Flask, render_template, request, redirect, Response
from sklearn.decomposition import TruncatedSVD
from sklearn.random_projection import sparse_random_matrix
import json

app = Flask(__name__)

@app.route("/output" , methods = ['POST'])
def output():
	#data = request.get_json()
	#print(data)
	#print(len(data))
	print(len(request.get_json()), len(request.get_json()[0]))
	#svdInput = np.empty((len(request.get_json()),len(request.get_json()[0])))
	#for i in range(0,len(request.get_json())):
		#svdInput[i] = request.get_json()[i]
#u, s, vh = svds(svdInput)
   
	#print (svdInput)
	#svdInput.asfptype()
    #ut, s, vt = sparsesvd(smat, 100)
    #u, s, vh = SL.svd(svdInput, full_matrices=False)
	#u, s, vh = svds(svdInput, k = min(svdInput.shape) - 1)
	#print(svdInput)
	#print(svdInput.shape)
	#svdInputTranspose = svdInput.T
	#svd = TruncatedSVD(n_components=svdInputTranspose.shape[0]-1, n_iter=7, random_state=42)
	
	#svd = TruncatedSVD(n_components=50, n_iter=7, random_state=42)
	#svd.fit(svdInputTranspose)
	if(np.asarray(request.get_json()).T.shape[0] > 1000):
		svd = TruncatedSVD(n_components=50, n_iter=7, random_state=42)
	else:
		svd = TruncatedSVD(n_components=np.asarray(request.get_json()).T.shape[0]-1, n_iter=7, random_state=42)
	#svd = TruncatedSVD(n_components=np.asarray(request.get_json()).T.shape[0]-1, n_iter=7, random_state=42)
	#svd = TruncatedSVD(n_components=50, n_iter=7, random_state=42)
	svd.fit(np.asarray(request.get_json()).T)
	#smat = scipy.sparse.csc_matrix(svdInput)
	#u, s, vh = sparsesvd(smat, min(smat.shape))
	#ut = u.T
    
    
	#result = [u, s, vh]
	#print(u)
	#return json.dumps(u.tolist())
	return json.dumps(svd.components_.T.tolist())
	#return ''

@app.route("/svds" , methods = ['POST'])
def functionSvds():
	svdInput = np.empty((len(request.get_json()),len(request.get_json()[0])))
	for i in range(0,len(request.get_json())):
		svdInput[i] = request.get_json()[i]
	u, s, vh = svds(svdInput, k = min(svdInput.shape) - 1)
	return json.dumps(u.tolist())

@app.route("/sparsesvd" , methods = ['POST'])
def sparseSvd():
	svdInput = np.empty((len(request.get_json()),len(request.get_json()[0])))
	for i in range(0,len(request.get_json())):
		svdInput[i] = request.get_json()[i]
	smat = scipy.sparse.csc_matrix(svdInput)
	u, s, vh = sparsesvd(smat, min(smat.shape))
	return json.dumps(u.T.tolist())

if __name__ == "__main__":
	app.run()