
# -*- coding: utf-8 -*-
"""
Created on Tue Aug 14 10:44:25 2018

@author: Vis
"""
#import numpy, scipy.sparse
#from sparsesvd import sparsesvd
#mat = numpy.random.rand(200, 100) # create a random matrix
#print (mat.shape)
#smat = scipy.sparse.csc_matrix(mat) # convert to sparse CSC format
#print (len(smat.shape[0]))
#ut, s, vt = sparsesvd(smat, 100) # do SVD, asking for 100 factors
#assert numpy.allclose(mat, numpy.dot(ut.T, numpy.dot(numpy.diag(s), vt))))  
#A = csc_matrix([[1, 0, 0], [5, 0, 2], [0, -1, 0], [0, 0, 3]], dtype=float)
#u, s, vt = svds(A, k=min(A.shape) - 1)
#u, s , vt = SPPY.rsvd(A)
#tem = ut.T
#print (tem.shape)

#array([ 2.75193379,  5.6059665 ])
#np.sqrt(eigs(A.dot(A.T), k=2)[0]).real
#array([ 5.6059665 ,  2.75193379])

from sklearn.decomposition import TruncatedSVD
from sklearn.random_projection import sparse_random_matrix
#X = sparse_random_matrix(1446, 210, density=0.01, random_state=42)
#Xt = X.T
svd = TruncatedSVD(n_components=50, n_iter=7, random_state=42)
svd.fit(sparse_random_matrix(1446, 210, density=0.01, random_state=42).T)  
TruncatedSVD(algorithm='randomized', n_components=5, n_iter=7,
        random_state=42, tol=0.0)
print(svd.components_.T.shape )  
#[ 0.0606... 0.0584... 0.0497... 0.0434... 0.0372...]
#print(svd.explained_variance_ratio_.sum())  
#0.249...
#print(svd.singular_values_)  
#[ 2.5841... 2.5245... 2.3201... 2.1753... 2.0443...]