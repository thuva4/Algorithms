#include <iostream>

int extendedEuclidean(int a, int b, int *x, int *y) {
	if (a == 0) {
		*x = 0;
		*y = 1;
		return b;
	}
	int x1, y1;
	int gcd = extendedEuclidean(b % a, a, &x1, &y1);
	*x = y1 - (b / a) * x1;
	*y = x1;
	return gcd;
}


int main() {
	int x, y, a, b;
	std::cout << "Enter the value of a, b: ";
	std::cin >> a >> b;
	int g = extendedEuclidean(a, b, &x, &y);

	std::cout << "The value of x, y is: " << x << ' ' << y << '\n';
}


