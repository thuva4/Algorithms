
#include <bits/stdc++.h>

#define ll long long

using namespace std;

//simple binary Search
//'low' is the lower index & 'high' is the upper index & 'key' is the value to be searched
int binarySearch(int low,int high,int key) 
{
   while(low<=high)
   {
     int mid = low+(high-low)/2;
     if(a[mid] < key)
     {
         low = mid + 1;
     }
     else if(a[mid] > key)
     {
         high = mid - 1;
     }
     else
     {
         return mid; // returns the index if key is found.
     }
   }
   return -1;                //key not found
 }
