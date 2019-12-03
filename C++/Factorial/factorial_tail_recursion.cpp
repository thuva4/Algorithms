#include <iostream>

using namespace std;

int factorial(int accumulator, int num) {
	if (num < 1) {
		
		return accumulator;
	}

	return factorial(accumulator * num, num - 1);
}


int main() {
	int num;
	cin >> num;
	int accumulator = 1;
	int result = factorial(accumulator, num);


	cout << result << endl;
}

