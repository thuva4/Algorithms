#include<stdio.h>
#include<conio.h>
int n,m,w[50],p[50],k[50][50],x[50],profit=0,i,j;
int max(int i,int j)   //return max of i and j
{
	if(i>j)         
	return i;
	else
	return j;  
}
int knap(int i,int j)
{
	int value;
	if(k[i][j]<0)
	{
		if(j-w[i]<0)
		{
			value=knap(i-1,j);
		}
		else
		{
			value=max(knap(i-1,j),p[i]+knap(i-1,j-w[i]));
		}
		k[i][j]=value;
	}
return k[i][j];
}
void main()
{
	clrscr();
	printf("Enter the number of elements");
	scanf("%d",&n);
	printf("\nEnter the maximun capacity of the knapsack");
	scanf("%d",&m);
	printf("\nEnter the wieghts of the elements");
	for(i=1;i<=n;i++)
	{
		scanf("%d",&w[i]);
	}
	printf("\nEnter the profits for the elements");
	for(i=1;i<=n;i++)
	{
		scanf("%d",&p[i]);
	}
	for(i=0;i<n+1;i++)
	{
		for(j=0;j<m+1;j++)
		{
			if((i==0)||(j==0))
			{
				k[i][j]=0;
			}
			else
			{
				k[i][j]=-1;
			}
		}
	}
	profit=knap(n,m);
	i=n;
	j=m;
	while((i!=0)&&(j!=0))
	{
		if(k[i][j]==k[i-1][j])
		{
			i--;
		}
		else
		{
			x[i]=1;
			j=j-w[i];
			i--;
		}
	}
	printf("\nThe items selected are");
	for(i=1;i<=n;i++)
	{
		if(x[i]==1)
		printf("\nItem=%d\t weight=%d\t profit=%d",i,w[i],p[i]);
	}

	printf("\nThe profit is=%d",profit);

getch();
}




