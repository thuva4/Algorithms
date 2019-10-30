#include <iostream>

using namespace std;

int main() {
	unsinged int n;
	unsigned int factorial = 1;

	cout << "Enter a positive integer: ";
	cin >> n;

	for (int i=1; i<=n; i++) {
		factorial*=i;
	}

	cout << "Factorial of " << n << " = " factorial;

	return 0;
}
