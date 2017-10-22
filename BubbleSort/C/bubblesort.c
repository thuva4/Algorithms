#include<stdio.h>

int main()
{
int n,i,j,temp;
printf("Enter number of elements in array\n");
scanf("%d",&n);
int A[n];
printf("Array before sorting\n");
for(i=0;i<n;i++)
	{
	A[i]=rand()%1000;
	printf("%d ",A[i]);	
	}
printf("\n");
for(i=0;i<n;i++)
	{
	for(j=n;j>i;j--)
		{
		  if(A[j]<A[j-1])
			{
			temp=A[j];
			A[i]=A[i-1];
			A[i-1]=temp;
			
			}	
		}	
	}
printf("Array after sorting\n");
for(i=0;i<n;i++) printf("%d ",A[i]);

printf("\n");
	
return 0;
}