#include <iostream>

using namespace std;

void xorswap(int &a, int &b) {
	a ^= b;
	b ^= a;
	a ^= b;
}

int main(int argc, char const *argv[]) {
	int a = 10, b = 5;
	xorswap(a, b);

	cout << "a: " << a << " b: " << b << endl;
	return 0;
}
