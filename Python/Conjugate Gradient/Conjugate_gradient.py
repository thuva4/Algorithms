# Solves the equation Ax=b, for x,
# if A is a real symmetric, positive semi-definite matrix.
# (Returns x)

import numpy as np

def conjugate_gradient(A,b,x=None):
	if not x:								# if we don't have a seed for x:
		x = np.ones(len(b))					# x = (1,...,1)

	r = b-np.dot(A,x)						# residue vector
	p = r
	r_k_norm = np.dot(r, r)
    for i in xrange(2*n):
        Ap = np.dot(A, p)
        alpha = r_k_norm / np.dot(p, Ap)
        x += alpha * p
        r -= alpha * Ap
        r_kplus1_norm = np.dot(r, r)
        if r_kplus1_norm < 1e-5:			# if the residue is small
            print('Iterations: ', i)		# break
            break
        beta = r_kplus1_norm / r_k_norm
        r_k_norm = r_kplus1_norm
        
        p = r + beta*p 
	return x
