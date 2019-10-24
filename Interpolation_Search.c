//interpolation search is also known as extrapolation search
#include<stdlib.h>
#include<stdio.h>
void insertionsort(int [],int );
int main()
{
	int n;
	printf("Enter the size of the array: ");
	scanf("%d",&n);	//declaration of array size
	int a[n],i;
	printf("Enter the elements: ");
	for(i=0;i<n;i++)
	{
		scanf("%d",&a[i]);	//taking the elements
	}
	insertionsort(a,n);	//sorting the elements to calculate the mid value correctly
	printf("The sorted array: ");
	for(i=0;i<n;i++)
	{
		printf("%d\t",a[i]);
	}
	int x,flag=0;
	printf("\nEnter the value you search for: ");
	scanf("%d",&x);	//taking the key
	int low=0,high=n-1,mid;		//taking first pos as low and last pos as high
	while(low<=high)
	{
		mid=low+(high-low)*((x-a[low])/(a[high]-a[low]));	//calculating mid pos efficiently than binary search
		if(x==a[mid]) 	//checking if mid pos value equals to key element or not
		{
			flag=1;
			printf("%d is found at %d position\n",x,mid+1);
			break;
		}
		else if(x>a[mid])	//if key element is greater than mid pos value then we should start checking from after mid pos as sorted array
		{
			low=mid+1;
		}
		else if(x<a[mid])
		{
			high=mid-1;	//if mid pos value is greater than key element then we should start checking from before mid pos as sorted array
		}
	}
	if(flag==0)
	{
		printf("The element is not found!\n");
	}
	return 0;
}
void insertionsort(int a[],int n)
{
	int i,j,temp;
	for(i=1;i<n;i++)
	{
		temp=a[i];
		j=i-1;
		while(temp<a[j]&&j>=0)
		{
			a[j+1]=a[j];
			a[j]=temp;
			j--;
		}
	}
}
