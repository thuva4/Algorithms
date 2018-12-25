#include <stdio.h>

int swap(int *a,int *b)
{
	int temp=*a;
	*a=*b;
	*b=temp;
}

int main()
{
	int a,b;
	printf("Enter first number-\n");
	scanf("%d",&a);
	printf("Enter second number-\n");
	scanf("%d",&b);

	swap(&a,&b);
	printf("First number after swapping- %d\n",a);
	printf("Second number after swapping- %d\n",b);


}