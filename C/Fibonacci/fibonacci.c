#include <stdio.h>


int main() {
  
  int i, v, num1 = 0, num2 = 1, temp;
  // Enter here number of times fib number is calculated;
  scanf("%d", &v);
  printf("Fibonacci numbers:");
  
  for (i = 0; i <= v; i++) {
    // This prints fibonacci number;
    printf("%d, ", num1);
    // This calculates fibonacci number;
    temp = num1 + num2;
    //if the sum becomes greater than range of int.
    if(num1>temp || num2 >temp){
        break;
    }
    num1 = num2;
    num2 = temp;
  }
    //the case for which break is encounterd
  if(i != v){
    cout<<"size became bigger than size of int";
  }
  return 0;
}
