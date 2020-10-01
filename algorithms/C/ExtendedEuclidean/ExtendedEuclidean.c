#include <stdio.h>
#include <iostream>
#include <assert.h>
using namespace std;

int ExtendedEuclidean(int a, int b, int *x, int *y)
{
	if (a == 0)
	{
		*x = 0;
		*y = 1;
		return b;
	}

	int _x, _y;
	int gcd = ExtendedEuclidean(b % a, a, &_x, &_y);

	*x = _y - (b/a) * _x;
	*y = _x;

	return gcd;
}

//Test the Algorithms
int main()
{
    int x, y;

	int a = 30;
	int b = 50;
    
	int gcd = ExtendedEuclidean(a, b, &x, &y);

	assert(gcd == 10);
	assert(x == 2);
	assert(y == -1);

	a = 44;
	b = 11;
	gcd = ExtendedEuclidean(a, b, &x, &y);
	assert(gcd == 11);
	assert(x == 0);
	assert(y == 1);
	
	printf("All tests are passed!!!!"\n);
	return 0;
}