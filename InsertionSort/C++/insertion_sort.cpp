/*
* @author Abhishek Datta
* @github_id abdatta
* @since 15th October, 2017
*
* The following algroithm takes a list of numbers
* and sorts them using the insertion sort algorithm.
*/

#include <iostream>
using namespace std;

// function to swap two numbers
void swap(int *a, int *b)
{
	int t = *a;
	*a = *b;
	*b = t;
}

// function to perform insertion sort
void insertion_sort(int *a, int n)
{
	for (int i = 1; i < n; i++) // iterating over all the elements
    {
    	int j = i; // j denotes the final position of the current element, which is initialised to the current position

    	while (j > 0 && a[j-1] > a[j]) // shift j until it is in the correct position
    	{
        	swap(a[j], a[j-1]); // swap with the shifted element
        	j--;
    	}
	}
}

// main function to try the algorithm
int main()
{
	int n; // number of elements to be read
	
	cin>>n;
	int *a = new int[n];

	// reading a list of unsorted numbers
	for (int i = 0; i < n; ++i)
		cin>>a[i];

	insertion_sort(a, n); // sorting the list

	// printing the sorted list
	for (int i = 0; i < n; ++i)
		cout<<a[i]<<' ';	
	cout<<endl;

	return 0;
}