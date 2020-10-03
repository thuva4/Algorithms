// including liberary
#include <stdio.h>

/*
  the algo goes here
*/
void Sort_Array(int arr[], int size)  // it will accept interger type array and size of the array
{
  // local variable defination
  int i, key, j;
  for (i = 1; i < size; i++)
  {
      key = arr[i]; // the i th value
      j = i-1;  // j is for processing from back

      /* Move elements of arr[0..i-1], that are
        greater than key, to one position ahead
        of their current position */
      while (j >= 0 && arr[j] > key)  // loop will work till j th value of array is greater than i th value of array and j >= 0
      {
          arr[j+1] = arr[j];
          j--;
      }
      arr[j+1] = key;
   }
}

/*
    MAIN FUNCTION
*/
int main() {
  // declaring the variable
  int size;  // size is the array length
  int i;  // i is for iterations
  printf("enter the size of array ");
  scanf("%d",&size);  // getting size
  int array[size]; // declaring array of size entered by the user

  // getting value from the user
  printf("\nenter values in the array\n");
  for (i = 0; i < size; i++) {scanf("%d", &array[i]); }

  // printing the original array
  printf("\noriginal array -> ");
  for (i = 0; i < size; i++) { printf("%d ", array[i]); }

  // sorting the array
  Sort_Array(array, size);

  // printing the sorted array
  printf("\nsorted array -> ");
  for (i = 0; i < size; i++) { printf("%d ", array[i]); }
  
  return 0;
}

