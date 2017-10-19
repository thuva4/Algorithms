
#include <stdio.h>
 
int main()
{
   int array[100] search, c, n=10; // n is the number of elements to be stored.
   
   int array[n]; //array[] is used to store the element
 
   printf("Enter the number to search\n");
   scanf("%d", &search);
 
   for (c = 0; c < n; c++)
   {
      if (array[c] == search)     /* if required element found */
      {
         printf("%d is present at location %d.\n", search, c+1);
         break;
      }
   }
   if (c == n)
      printf("%d is not present in array.\n", search);
 
   return 0;
}