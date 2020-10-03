#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define MAX 100000

int main()
{
    int a[MAX];
    int i,j,n;
    clock_t s,e;
    double t;
    //size of elements 
    printf("enter the size\n");
    //input elements
    scanf("%d",&n);
    printf("enter the array elements\n");
    for(i=0;i<n;i++)
    {
        a[i]=rand()%100;
    }
    //display_array_elements
    printf("array element before sorting\nt");
     for(i=0;i<n;i++)
    {
        printf("%d\t",a[i]);
    }
    //time complexity calculation
    s=clock();
        for(i=0;i<1000;i++)
        for(j=0;j<1000;j++)
            insertionSort(a,n);

    e=clock();
    t=(double)(e-s)/CLK_TCK;
    //sorted arrays
      printf("\narray element after sorting\n");
     for(i=0;i<n;i++)
    {
        printf("%d\t",a[i]);
    }
    printf("\ntime taken to sort the given array is = %lf",t);

}
//function for insterion sort
void  insertionSort(int a[],int n)
{
    int i,j,key;
    for(i=1;i<=n;i++)
    {
        key=a[i];
        j=i-1;
        while(j>=0&&a[j]>key)
        {
            a[j+1]=a[j];
            j=j-1;
        }
        a[j+1]=key;
    }
}
