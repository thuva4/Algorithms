#include<stdio.h>
int fibonacci(int n)
{
if(n==0)
  return 0;
else if(n==1)
  return 1;
else
  return (fibonacci(n-1)+fibonacci(n-2));
}
void main()
{
int numberOfTerms,i;
clrscr();
printf("Enter the number of terms:");
scanf("%d",&numberOfTerms);
printf("\n\nFibonacci series:\n");
for(i=0;i<numberOfTerms;i++)
{
printf("%d  ",fibonacci(i));
}
getch();
}