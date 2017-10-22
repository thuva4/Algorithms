
#include <bits/stdc++.h>

#define ll long long

using namespace std;

//simple recursive binary Search
//'low' is the lower index & 'high' is the upper index & 'key' is the value to be searched

int binarySearch(int low,int high,int key)
{
   if(low<=high)
   {
     int mid = (low + high) / 2;

     if(a[mid] == key)
        return mid          // returns the index if key is found.

     if(a[mid] < key)
     {
         return binarySearch(mid + 1, high, key);
     }
     else
     {
         return binarySearch(low, mid-1, key);
     }

   }
   return -1;                //key not found
 }
