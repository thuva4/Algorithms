#include <stdio.h>

int main()
{
   int c, f, lt, mid, n, sr, array[100];

   printf("Enter number of elements\n");
   scanf("%d",&n);

   printf("Enter %d integers\n", n);

   for (c = 0; c < n; c++)
      scanf("%d",&array[c]);

   printf("Enter value to find\n");
   scanf("%d", &sr);

   f = 0;
   lt = n - 1;
   mid = (f+lt)/2;

   while (f <= lt) {
      if (array[mid] < sr)
         f = mid + 1;
      else if (array[mid] == sr) {
         printf("%d found at location %d.\n", sr, mid+1);
         break;
      }
      else
         lt = mid - 1;

      mid = (f + lt)/2;
   }
   if (f > lt)
      printf("Not found!", sr);

   return 0;
}
