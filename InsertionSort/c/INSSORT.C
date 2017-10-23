#include<stdio.h>

void InsSort(int arr[])
{
int i, j, k;
for (i = 1; i < 10; i++)
  {
  k = arr[i];
  j = i-1;
  while (j >= 0 && arr[j] > k)
    {
    arr[j+1] = arr[j];
    j = j-1;
    }
  arr[j+1] = k;
   }
}

void main()
{
int i, arr[] = {0,9,1,8,22,5,6,77,45,2};
InsSort(arr);
for (i=0; i < 10; i++)
  printf("%d ", arr[i]);
}