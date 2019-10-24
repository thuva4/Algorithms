#include<stdlib.h>
#include <stdio.h>
void shellsort(int arr[], int num)
{
    int i,j,k,tmp;
    for (i=num/2;i>0;i=i/2)	//divide array into two set
	{
		for (j=i;j<num;j++)
		{
			for(k=j-i;k>=0;k=k-i)
			{
				if (arr[k+i]>=arr[k])	//compare each element with its ith element
				{
					break;
				}
                                else
				{
				    tmp=arr[k];
				    arr[k]=arr[k+i];
				    arr[k+i]=tmp;
				}
			}
		}
	}
}
int main()
{
	int arr[30];
	int k,num;
	printf("Enter total no. of elements : ");
	scanf("%d",&num);	//size declaration
	printf("\nEnter %d numbers: ",num);
	for (k=0;k<num;k++)
	{
		scanf("%d",&arr[k]);	//array input
	}
	shellsort(arr,num);
	printf("\n Sorted array is: ");
	for (k=0;k<num;k++)
	{
	    printf("%d ",arr[k]);	//sorted array output
	}
    return 0;
}
