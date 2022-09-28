#include <stdio.h>
#include <stdlib.h>
#define ll long long

// simple recursive binary Search
//'low' is the lower index & 'high' is the upper index & 'key' is the value to be searched

int binarySearch(int *a, int low, int high, int key)
{
    if (low <= high)
    {
        int mid = low + (high - low) / 2;

        if (a[mid] == key)
            return mid; // returns the index if key is found.

        if (a[mid] < key)
        {
            return binarySearch(a, mid + 1, high, key);
        }
        else
        {
            return binarySearch(a, low, mid - 1, key);
        }
    }
    return -1; // key not found
}

// simple recursive binary Search
//'low' is the lower index & 'high' is the upper index & 'key' is the value to be searched
int main()
{
    int n, i,key,size,low;
    printf("Enter value of n: ");
    scanf("%d", &n);
    int *ptr = NULL;
    ptr = (int *)calloc(n, sizeof(int));
    printf("Enter values \n");
    for (i = 0; i < n; i++)
    {
        printf("Enter value %d: ", i);
        scanf("%d", (ptr + i));
    }
    printf("Enter value of key: ");
    scanf("%d", &key);
    size = n - 1;
    low = 0;
    printf("%d",binarySearch(ptr,0,size,key));
    return 0;
}
