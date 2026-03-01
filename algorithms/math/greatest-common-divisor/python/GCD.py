"""
This code is for GCD of two numbers in O(log(n)) time.
This code is compatible with python 2 as well as python3
"""
try:
	input = raw_input
except:
	pass
def gcd(a, b):
	if b == 0:
		return a
	return gcd(b , a%b)	    

if __name__ == "__main__":
	a,b = tuple(map(int , input("Enter two numbers separated by spaces for gcd: ").split(" ")))
	print(a,b)
	print("GCD of ",a," and ",b,"is",gcd(a,b))    
