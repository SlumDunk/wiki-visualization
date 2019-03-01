#!C:\Users\Vis\AppData\Local\Programs\Python\Python37-32\python.exe

# This will print to stdout for testing
import sys, json
import numpy as np
import scipy.linalg as SL


#print (sys.argv)
lines = [line.strip() for line in open('temp.dat')]
#try:
#    who = json.loads(sys.argv[1])
#except:
#    print ("ERROR")
#    sys.exit(1)

#print (who)
#print ("Hello world")

subarray = []
mainarray = []
firstDimension = len(lines)
secondDimension = len(lines[0])

svdInput = np.empty((firstDimension,secondDimension))

for i in range(0, firstDimension):
    for j in range(0, secondDimension):
        svdInput[i][j] = int(lines[i][j])
#print ((mainarray))
a = np.random.randn(9, 6) + 1j*np.random.randn(9, 6)
#print (a)

i = np.asarray(mainarray)

u, s, vh = SL.svd(svdInput, full_matrices=False)
#assert np.allclose(svdInput, np.dot(u, np.dot(np.diag(s), vh)))
#au, aS, avh = np.linalg.svd(a, full_matrices=True)

result = [u, s, vh]

print(u.tolist())
