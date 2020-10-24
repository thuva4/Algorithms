#include<iostream>
using namespace std;
///program to sort an array using insertion sort recursively
///time complexity= O(n)
///space complexity = O(1) extra space

// Recursive function to sort an array using
// insertion sort
void insertionSortRecursive(int arr[], int n)
{
    // Base case
    if (n <= 1)
        return;

    // Sort first n-1 elements
    insertionSortRecursive( arr, n-1 );

    // Insert last element at its correct position
    // in sorted array.
    int last = arr[n-1];
    int j = n-2;

    /* Move elements of arr[0..i-1], that are
      greater than key, to one position ahead
      of their current position */
    while (j >= 0 && arr[j] > last)
    {
        arr[j+1] = arr[j];
        j--;
    }
    arr[j+1] = last;
}
int main()

{
    int *arr;int n;
    cin>>n;
    arr=new int[n];   ///dynamic initialization of array
    for(int j=0;j<n;j++)
        cin>>arr[j];

    insertionSortRecursive(arr, n);
    for(int i=0;i<n;i++)
        cout<<arr[i]<<endl;
    return 0;
}
