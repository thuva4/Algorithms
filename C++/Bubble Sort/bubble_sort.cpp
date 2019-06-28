#include <iostream>
using namespace std;

void swap(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}
 

void bubbleSort(int arr[], int n)
{
   int i, j;
   for (i = 0; i < n-1; i++)       
       for (j = 0; j < n-i-1; j++) 
           if (arr[j] > arr[j+1])
              swap(&arr[j], &arr[j+1]);
}
 
void printArray(int arr[], int size)
{
    int i;
    for (i=0; i < size; i++)
        cout<<arr[i]<<" ";
}
 
int main()
{
    int arr[100],n;
    cout<<"Enter the size of array : \n";
    cin>>n;
    cout<<"Enter the elements : \n";
    for(int i=0 ; i<n ; i++){
        cin>>arr[i];
        }
    //int n = sizeof(arr)/sizeof(arr[0]);
    bubbleSort(arr, n);
    cout<<"Sorted Array : \n";
    printArray(arr, n);
    return 0;
}
