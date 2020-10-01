#include <bits/stdc++.h> 
using namespace std; 

int gcdExtended(int a, int b, int x, int y) 
{ 
	if (a == 0) 
	{ 
		x = 0; 
		y = 1; 
		return b; 
	} 

	int x1, y1; 
	int gcd = gcdExtended(b%a, a, x1, y1); 

	x = y1 - (b/a) * x1; 
	y = x1; 

	return gcd; 
} 

int main() 
{ 
	int x=1, y=1, a , b ; 
	cin>>a>>b;
	assert(a>0);
	assert(b>0);
	int res = gcdExtended(a, b, x, y); 
	cout << "GCD of " << a << " and " << b 
		<< " is " << res << endl; 
	return 0; 
} 
