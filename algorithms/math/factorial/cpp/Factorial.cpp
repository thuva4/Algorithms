/*
* author Christian Escolano
* github_id Esci92
*
* Callc Factorial value
*/

// Includes
#include<iostream>    

int factorialRecurrent(unsigned long InputValue)
{
	//Check if exeption 0 is given as input
	if (InputValue == 0) {

		// Value is 1 for 0
		return(1);
	}

	else {

		// Recurrent calculating Factorial
		return(InputValue * factorialRecurrent(InputValue - 1));
	}
}

int main()
{
	// Namespaces
	using namespace std;

	// Variables
	unsigned int InputValue;
	unsigned long result;

	// Get User Input for the Calculation of the Factorialvalue
	cout << "Enter the Number to Calculate the Factorialvalue: ";
	cin >> InputValue;

	// Call function 
	result = factorialRecurrent(InputValue);

	// Sending the Value
	cout << endl;
	cout << "The Factorial number of ";
	cout << InputValue;
	cout << "! is ";
	cout << result;
	cout << endl;

	// Return 0 is success
	return 0;
}
