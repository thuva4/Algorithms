#include <stdio.h>

int linear_search(int arr[], int n, int target){
  int i;
  for(i=0;i<=n;i++)
    if(arr[i] == target)
      return i; // If the target is found, it returns it's position
  return -1; // If it's not present in the array, it returns -1
}

int main(){
  int ARR[] = {1, 3, 2, 8, 10};

  int result = linear_search(ARR, 5, 2);

  if(result != -1)
    printf("Target preset at %d position", result+1);
  else
    printf("Target not presetnt in the array.");

  return 0;
}
