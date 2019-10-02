#include <stdio.h>

int linearSearch(int* array, int n, int element) {
  for(int i = 0; i < n; i++) {
    if(*(array+i) == element) {
      return i;
    }
  }

  return -1;
}

int main() {
  int array[] = {5, 4, 7, 9, 1, 2, 6, 8, 0};
  int n = 9;
  int element1 = 3;
  int element2 = 4;

  int index1 = linearSearch(array, n, element1);
  if(index1 >= 0) {
    printf("Element %d exists at index %d.\n", element1, index1);
  } else {
    printf("Element %d doesn't exist in the given array.\n", element1);
  }

  int index2 = linearSearch(array, n, element2);
  if(index2 >= 0) {
    printf("Element %d exists at index %d.\n", element2, index2);
  } else {
    printf("Element %d doesn't exist in the given array.\n", element2);
  }

  return 0;
}