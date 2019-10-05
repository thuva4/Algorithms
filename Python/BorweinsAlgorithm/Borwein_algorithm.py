# Calculates an estimation for 1/pi
# with various convergences

import numpy as np

def Borwein_2(k):			# Quadratic convergence 
	a = np.sqrt(2)
	b = 0
	p = 2 + np.sqrt(2)
	for i in range(k):
		b = (1+b)*np.sqrt(a)/(a+b)
		a = (np.sqrt(a)+1/np.sqrt(a))/2
		p = ((1+a)*p*b)/(1+b)
	return p
	

def Borwein_3(k):			# Cubic convergence 
	a = 1./3
	s = (np.sqrt(3)-1)/2
	for i in range(k):
		r = 3/(1+2*(1-s**3)**(1./3))
		s = (r-1)/2
		a = r**2*a-3**i*(r**2-1)
	return a
	

def Borwein_4(k):			# Quartic convergence 
	a = 6-4*np.sqrt(2)
	y = np.sqrt(2)-1
	for i in range(k):
		y = (1-(1-y**4)**(1./4))/(1+(1-y**4)**(1./4))
		a = a*(1+y)**4 -2**(2*i+3)*y*(1+y+y**2)
	return a
	
	
