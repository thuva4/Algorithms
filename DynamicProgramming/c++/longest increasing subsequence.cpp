#include <bits/stdc++.h>
using namespace std;
vector <int> lis( int arr[], int n, vector <int> seq)
{
   int i, j, ma = 0,ind;
   int a[n];

   /* Initialize LIS values for all indexes */
   for ( i = 0; i < n; i++ )
      a[i] = 1;

   /* Compute optimized LIS values in bottom up manner */
   for ( i = 1; i < n; i++ ){
      for ( j = 0; j < i; j++ ){
         if ( arr[i] > arr[j] && a[i] < a[j] + 1){
            a[i] = a[j] + 1;
	 }
	 if (a[i]>ma){
	    ma=a[i];
	    ind=i;
         }
      }
   }

   i=ind-1,j=ma;
   seq.push_back(arr[ind]);
   while (i>=0){
      if (a[i]==(j-1)){
        j=a[i];
        seq.push_back(arr[i]);
      }
      i--;
   }
   return seq;
}
int main ()
{
  vector <int> seq (0);
  int arr[] = { 10, 22, 9, 33, 21, 50, 41, 60 };
  int n = sizeof(arr)/sizeof(arr[0]);
  seq=lis(arr,n,seq);
  n=seq.size();
  printf("Length of LIS is %d\n", n );
  for (int i=n-1;i>=0;i--)
    printf("%d  ",seq[i]);
  return 0;
}
