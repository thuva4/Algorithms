#include <stdio.h>
#include <stdlib.h>

int parent(int i){
	int p;
	if(i%2==0){p=i/2-1;}
	else{p=i/2;}
	return p;
}

void maxheapify(int a[],int n){
	for(int i=1;i<n;i++){
		int s=i;
		int p=parent(s);
		while(p>=0 && a[p]<a[s]){
			int key=a[p];
			a[p]=a[s];
			a[s]=key;
			s=p;
			p=parent(s);
		}
	}
}

void heapsort(int a[],int n){
	for(int i=0;i<n;i++){
		maxheapify(a,n-i);
		int key=a[0];a[0]=a[n-i-1];a[n-i-1]=key;
	}
	
}

int main()
{
	printf("Enter the number of elements in the heap.\n");
	int n;
	scanf("%d",&n);
	int *a = (int *)malloc(sizeof(int) * n);
	printf("Enter the values in the heap.\n");
	for(int i=0;i<n;i++)
	{
		scanf("%d",&a[i]);
	}
	heapsort(a,n);
	printf("Heap after heapsort is\n");
	for(int i=0;i<n;i++)
	{
		printf("%d ",a[i]);
	}
	printf("\n");
}
