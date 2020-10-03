#include<stdio.h>
#include<omp.h>
int min(int a,int b)
{
	if(a<b)
	return a;
	else
	return b;
}
int main()
{
	int a[10][10],n,i,j,k;
	double st,et,tt;
	printf("\nEnter the number of nodes");
	scanf("%d",&n);
	printf("\nEnter the cost matrix");
	for(i=1;i<=n;i++)
	{
		for(j=1;j<=n;j++)
		{
			scanf("%d",&a[i][j]);
			if(a[i][j]==0)
				a[i][j]=999;
		}
	}
	st=omp_get_wtime();
	for(k=1;k<=n;k++)
	{
	
		for(i=1;i<=n;i++)
		{
		
			for(j=1;j<=n;j++)
			{
				a[i][j]=min(a[i][j],a[i][k]+a[k][j]);
			}
		}
	}
	et=omp_get_wtime();
	tt=et-st;
	printf("\nThe shortest path matrix is");
	for(i=1;i<=n;i++)
	{
		for(j=1;j<=n;j++)
		{
			printf("%d\t",a[i][j]);
		}
		printf("\n");
	}
	printf("\nThe paths from each node is:");
	for(i=1;i<=n;i++)
	{
		for(j=1;j<=n;j++)
		{
			if(i!=j)
			{
				printf("%d->%d=%d\t",i,j,a[i][j]);
			}
		}
		printf("\n");
	}
	printf("\nThe start time is:\t%g",st);
	printf("\nThe end time is:\t%g",et);
	printf("\nThe time taken is:\t%g",tt);
	

}
				
			
