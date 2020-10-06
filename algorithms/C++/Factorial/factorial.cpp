// This program calculates the factorial of a number

#include<iostream>
#include<algorithm>

using namespace std;

//typedef
typedef unsigned int uit;

//function to calculate the factorial using the Iterative method as recursion 
//Time Complexity : O(N)
//Space Complexity: O(1)
uit factorial(uit n)
{
    uit fact = 1;
    for(auto i = 1;i<=n;i++)
    {
        // definition of factorial ie n! = n*(n-1)....*1
        fact *= i; 
    }
    return fact;
}

//main function
int main()
{
    //get the Input
    uit input;
    cin>>input;
    //print out the factorial
    cout<<"The factorial is : "<<factorial(input);
    return 0;
}


