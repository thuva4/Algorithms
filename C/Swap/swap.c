#include <stdio.h>

long int swap(long int *a,long int *b)
{
	long int temp=*a;
	*a=*b;
	*b=temp;
}

int main()
{
	long int a,b;
	printf("Enter first number-\n");
	scanf("%ld",&a);
	printf("Enter second number-\n");
	scanf("%ld",&b);

	swap(&a,&b);
	printf("First number after swapping- %ld\n",a);
	printf("Second number after swapping- %ld\n",b);


}
