#include <iostream>
#include <string>

using namespace std;

int main() {

	// Declaring variables
	int n;
	string code = "0";
	
	// Get the desired number to be encoded
	cout << "Enter the desired number: ";
	cin >> n;
	
	// Appending the code string with 1's
	for (int i = 0; i < n; i++) {
		code = '1' + code;
	}

	// Print out the encoded string
	cout << code << endl;

	return 0;
}
