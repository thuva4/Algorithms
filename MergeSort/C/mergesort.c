//Merge Sort
#include<stdio.h>
#include<conio.h>
#include<stdlib.h>
#define MAX 100

int arr[MAX],count=0;
void merge_sort(int arr[] ,int , int );
void merge(int arr[] , int ,int , int );

void main()
{
	int n,i;
	clrscr();
	printf("Enter the total number of elements to be sorted\n");
	scanf("%d",&n);
	printf("Enter the elements\n");
	for(i=0;i<n;i++)
		scanf("%d",&arr[i]);

	merge_sort(arr,0,n-1);
	for(i=0;i<n;i++)
		printf("%d",arr[i]);
	printf("\nCount is %d",count);
	getch();

}
void merge(int arr[],int beg,int mid,int end)
{
	int k,i=beg,j=mid+1,index=beg,temp[MAX];
	while((i<=mid)&&(j<=end)) {
		if(arr[i]<arr[j]) {
			temp[index]=arr[i];
			i++;
		}
		else {
			temp[index]=arr[j];
			j++;
		}
		index++;
	}

	if(i>mid) {
		while(j<=end) {
			temp[index]=arr[j];
			j++;
			index++;
		}
	}
	else {
		while(i<=mid) {
			temp[index]=arr[i];
			i++;
			index++;
		}
	}
	for(k=beg;k<index;k++)
		arr[k]=temp[k];

}
void merge_sort(int arr[],int beg,int end)
{       int mid;
	if(beg<end) {
		count++;
		mid=(beg+end)/2 ;
		merge_sort(arr,beg,mid);
		merge_sort(arr,mid+1,end);
		merge(arr,beg,mid,end);
	}
}