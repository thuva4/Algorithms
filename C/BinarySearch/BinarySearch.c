
#include <stdio.h>
 
int main()
{
   int first, last, n=10, array[10],mid,search,; //n is the number of input elements
 
   int array[10] //Array to store the input elements  

   printf("Enter value to find\n");
   scanf("%d", &search);
 
   first = 0;
   last = n - 1;
   mid = (first+last)/2;
 
   while (first <= last) {
      if (array[mid] < search)
         first = mid + 1;    
      else if (array[mid] == search) {
         printf("%d found at location %d.\n", search, mid+1);
         break;
      }
      else
         last = mid - 1;
 
      mid = (first + last)/2;
   }
   if (first > last)
      printf("Not found! %d is not present in the list.\n", search);
 
   return 0;   
}