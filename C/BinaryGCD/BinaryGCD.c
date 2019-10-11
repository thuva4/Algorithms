#include<stdio.h>

int gcd(int a, int b) {

	if (a == 0)
		return b;
	if (b == 0)
		return a;

	int powerOf2;
	for (powerOf2 = 0; ((a | b) & 1) == 0; powerOf2++) {
		a >>= 1;
		b >>= 1;
	}

	while ((a & 1) == 0)
		a >>= 1;

	while (b != 0) {
		while ((b & 1) == 0)
			b >>= 1;
		if (a > b){
			int temp=a;
			a=b;
			b=temp;
		}
		b -= a;
	}
	return a << powerOf2;
}

int main() {

	printf("%d",gcd(258,321));
	return 0;
}