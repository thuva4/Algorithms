#include <stdio.h>
#include <assert.h> 

int Fibonacci(int num) {
  int i, num1 = 0, num2 = 1, temp;
  for (i = 0; i < num; i++) {
    temp = num1 + num2;
    num1 = num2;
    num2 = temp;
  }
  return temp;
}

int main() {
  int f_num_5 = Fibonacci(5);
  int f_num_13 = Fibonacci(13);
  assert(f_num_5 == 8);
  assert(f_num_13 == 377);
  printf("All tests are passed!!!!\n");
  return 0;
}
