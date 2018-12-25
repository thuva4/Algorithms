#include <cmath>
#include <cstdio>
#include <iostream>
using namespace std;

//Borwein's algorithm
//gionuno

typedef long double ld;

ld quad_convergence(int T)
{
	ld a0 = sqrt(2.0);
	ld b0 = 0.0;
	ld p0 = 2.0+a0;
	for(int n=0;n<T;n++)
	{
		ld sa = sqrt(a0);
		ld an = 0.5*(sa+1./sa);
		ld bn = (1.0+b0)*sa/(a0+b0);
		ld pn = (1.0+an)*p0*bn/(1.0+bn);
		a0 = an;
		b0 = bn;
		p0 = pn;
	}	
	return p0;
}

int main()
{
	cout.precision(17);
	cout << "pi approx " << fixed << quad_convergence(20) << endl;
	return 0;
}
