#include<stdio.h>
#include<stdlib.h>
void move(int ,int ,int ,int );
int main()
{
	int n;
	printf("Enter the number of disks: ");
	scanf("%d",&n);
	move(n,1,3,2);
	return 0;
}
void move(int n,int source,int dest,int spare)
{
	if(n==1)
	{
		printf("Move from %d to %d\n",source,dest);
	}
	else
	{
		move(n-1,source,spare,dest);
		move(1,source,dest,spare);
		move(n-1,spare,dest,source);
	}
}
