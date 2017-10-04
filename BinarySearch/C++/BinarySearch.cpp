
#include <bits/stdc++.h>

#define ll long long

using namespace std;

//simple binary Search

int binarySearch(int low,int high,int key)
{
   while(low<=high)
   {
     int mid = (low + high) / 2;
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
         return mid;
     }
   }
   return -1;                //key not found
 }