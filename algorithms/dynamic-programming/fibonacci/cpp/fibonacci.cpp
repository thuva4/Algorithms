#include <stdio.h>
#include <iostream> 	
using namespace std;

int i, v, num1 = 0, num2 = 1, temp;

int main() {
  // Enter here number of times fib number is calculated;
  cout<<" Enter the number of Fibonacci Numbers you want !"<< endl;
  scanf("%d", &v);
  printf("Fibonacci numbers:");
  
  for (i; i <= v; i++) {
    // This prints fibonacci number;
    // This calculates fibonacci number;
    temp = num1 + num2;
    num1 = num2;
    num2 = temp;
    cout<<num1<< " ,";

  }
  return 0;
}