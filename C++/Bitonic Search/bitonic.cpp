#include <iostream> 
  
using namespace std; 
  
// Function for binary search in ascending part 
int ascendingBinarySearch(int arr[], int low, 
                           int high, int key) 
{ 
   while (low <= high) 
   { 
       int mid = low + (high - low) / 2; 
       if (arr[mid] == key) 
           return mid; 
       if (arr[mid] > key) 
           high = mid - 1; 
       else
           low = mid + 1; 
   } 
    return -1; 
} 
  
// Function for binary search in descending part of array 
int descendingBinarySearch(int arr[], int low,  
                            int high, int key) 
{ 
   while (low <= high) 
   { 
       int mid = low + (high - low) / 2; 
       if (arr[mid] == key) 
           return mid; 
       if (arr[mid] < key) 
           high = mid - 1; 
       else
           low = mid + 1; 
   } 
    return -1; 
} 
   
// finding bitonic point 
int findBitonicPoint(int arr[] ,int n, int l, int r ) 
{ 
    int mid; 
      
    mid = (r + l) / 2; 
    if(arr[mid] > arr[mid-1] && arr[mid] > arr[mid + 1]) 
    { 
        return mid; 
    } 
      
    else 
    if(arr[mid] > arr[mid - 1] && arr[mid] < arr[mid + 1]) 
    { 
        findBitonicPoint(arr,n, mid , r); 
    } 
  
    else 
    if(arr[mid] < arr[mid - 1] && arr[mid] > arr[mid + 1]) 
    { 
        findBitonicPoint(arr, n, l, mid); 
    } 
} 
  
// Function to search key in bitonic array 
int searchBitonic(int arr[], int n, int key, int index) 
{ 
    if(key > arr[index]) 
        return -1; 
      
    else if(key == arr[index]) 
        return index; 
      
    else
    {    int temp = ascendingBinarySearch(arr, 0, index - 1, key); 
        if (temp != -1) 
        { 
             return temp; 
        } 
          
        // Search in right of k 
        return descendingBinarySearch(arr, index + 1, n - 1, key); 
    } 
} 
  
// Driver code 
int main() { 
    int arr[] = {-8, 1, 2, 3, 4, 5, -2, -3}; 
    int key = 1; 
    int n ,l, r; 
    n = sizeof(arr)/sizeof(arr[0]); 
    l = 0; 
    r = n - 1; 
    int index; 
    index = findBitonicPoint(arr, n, l, r); 
       
    int x = searchBitonic(arr, n, key, index); 
      
    if (x == -1) 
       cout << "Element Not Found"<<endl; 
    else
       cout << "Element Found at index " << x<<endl; 
      
    return 0; 
} 