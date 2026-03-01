#include<stdio.h>

// Function to calculate GCD
int gcd(int a, int b)
{
    int temp;
    while (b != 0)
    {
        temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}
//Driver function
int main() {
	int a,b;
        // Input the numbers
	scanf("%d %d",&a,&b);
	printf("%d\n", gcd(a,b));
}
