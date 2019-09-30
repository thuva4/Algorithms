#include<iostream>
using namespace std;
//Recursive Function to calculate GCD 
int gcd(int a,int b)
{
	 if(b==0)
	 	return a;
	 else
	 	return gcd(b,(a%b));
}
//Driver program 
int main()
{
	int a,b;
	cout << "Enter the two numbers to calculate gcd" << endl;
	cin >> a >>b;
	cout <<"Gcd of " << a << " " << b << "is "<< gcd(a,b)<< endl;
	return 0;
}