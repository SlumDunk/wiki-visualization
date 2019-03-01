import theano as th
import theano.tensor as T
from numpy import random as rng
import os
import gzip
import cPickle
import numpy as np
import unicodecsv
import sys

class AutoEncoder(object):
    def __init__(self, X, hidden_size, activation_function,
                 output_function):
        #X is the data, an m x n numpy matrix
        #where rows correspond to datapoints
        #and columns correspond to features.
        assert type(X) is np.ndarray
        assert len(X.shape)==2
        self.X=X
        self.X=th.shared(name='X', value=np.asarray(self.X, 
                         dtype=th.config.floatX),borrow=True)
        #The config.floatX and borrow=True stuff is to get this to run
        #fast on the gpu. I recommend just doing this without thinking about
        #it until you understand the code as a whole, then learning more
        #about gpus and theano.
        self.n = X.shape[1]
        self.m = X.shape[0]
        #Hidden_size is the number of neurons in the hidden layer, an int.
        assert type(hidden_size) is int
        assert hidden_size > 0
        self.hidden_size=hidden_size
        initial_W = np.asarray(rng.uniform(
                 low=-4 * np.sqrt(6. / (self.hidden_size + self.n)),
                 high=4 * np.sqrt(6. / (self.hidden_size + self.n)),
                 size=(self.n, self.hidden_size)), dtype=th.config.floatX)
        self.W = th.shared(value=initial_W, name='W', borrow=True)
        self.b1 = th.shared(name='b1', value=np.zeros(shape=(self.hidden_size,),
                            dtype=th.config.floatX),borrow=True)
        self.b2 = th.shared(name='b2', value=np.zeros(shape=(self.n,),
                            dtype=th.config.floatX),borrow=True)
        self.activation_function=activation_function
        self.output_function=output_function
                    
    def train(self, n_epochs=100, mini_batch_size=1, learning_rate=0.1):
        index = T.lscalar()
        x=T.matrix('x')
        params = [self.W, self.b1, self.b2]
        hidden = self.activation_function(T.dot(x, self.W)+self.b1)
        output = T.dot(hidden,T.transpose(self.W))+self.b2
        output = self.output_function(output)
        
        #Use cross-entropy loss.
        L = -T.sum(x*T.log(output) + (1-x)*T.log(1-output), axis=1)
        cost=L.mean()       
        updates=[]
        
        #Return gradient with respect to W, b1, b2.
        gparams = T.grad(cost,params)
        
        #Create a list of 2 tuples for updates.
        for param, gparam in zip(params, gparams):
            updates.append((param, param-learning_rate*gparam))
        
        #Train given a mini-batch of the data.
        train = th.function(inputs=[index], outputs=[cost], updates=updates,
                            givens={x:self.X[index:index+mini_batch_size,:]})
                            

        import time
        start_time = time.clock()
        for epoch in xrange(n_epochs):
            print "Epoch:",epoch
            for row in xrange(0,self.m, mini_batch_size):
                train(row)
        end_time = time.clock()
        print "Average time per epoch=", (end_time-start_time)/n_epochs
                   
    def get_hidden(self,data):
        x=T.dmatrix('x')
        hidden = self.activation_function(T.dot(x,self.W)+self.b1)
        transformed_data = th.function(inputs=[x], outputs=[hidden])
        return transformed_data(data)
    
    def get_weights(self):
        return [self.W.get_value(), self.b1.get_value(), self.b2.get_value()]


print "TRAINING PHASE"

# CREATE RANDOM DATA
X = numpy.random.random((1000,5000))

# INITIALIZE THE AUTO ENCODER
hdnodes = 400
activation_function = T.nnet.sigmoid
output_function=activation_function
print "...initialising"
A = AutoEncoder(X, hdnodes, activation_function, output_function) # LOAD THE DATA INTO THE AUTOENCODER
print "...training"
A.train(20,20)
W=np.transpose(A.get_weights()[0])

# STORE THE LEARNED AUTO-ENCODER, SO THAT YOU DONT HAVE TO LEARN IT EVERYTIME
f = file(FILE_LOCATION + ".obj","wb") # Specify file location
cPickle.dump(A, f, protocol=cPickle.HIGHEST_PROTOCOL)
f.close()


# LOAD THE PREVIOUSLY LEARNED AUTO-ENCODER
print 'loading learned model...'
f = file(FILE_LOCATION +  ".obj","rb") # Specify file location
A = cPickle.load(f)
f.close()
print 'loaded model..'

# Create another random data of 10 rows for creating its auto-encoded features
# or
# Can also load from some file
Xnew = numpy.random.random((10,5000)) 
learned_features = A.get_hidden(Xnew) ### THIS GIVES THE LEARNED FEATURES FROM THE NEW DATA

