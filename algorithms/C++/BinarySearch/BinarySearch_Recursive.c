#include <stdio.h>
void print(int *arr, int s, int e)
{
    printf( "Printing Array\n" );
    for (int i = 0; i <=e; i++)
    {
        printf("%d ",arr[i]);
    }
    printf("\n");
}
int binarySearch(int *arr, int s, int e, int key)
{
    

    if (s > e)
    {
        return 0;
    }
    int mid = s + (e - s) / 2;

    if (arr[mid] == key)
    {
        return 1;
    }
   
    if (arr[mid] < key)
    {
        return binarySearch(arr, mid + 1, e, key);
    }
     else
    {
        return binarySearch(arr, s, mid - 1, key);
    }
}
int main()
{
    int n;
    printf("Enter size of array: ");
    scanf("%d",&n);
    int arr[n];
    printf("Enter element into the array");
    for(int i = 0; i < n; i++)
    {
      scanf("%d",&arr[i]);
    }
    int size = n;
    int key;
    printf("Enter the value you want to search: ");
    scanf("%d",&key);
    int ans = binarySearch(arr, 0, size - 1, key);
    printf("Present or not %d",ans);
    
    return 0;
}
