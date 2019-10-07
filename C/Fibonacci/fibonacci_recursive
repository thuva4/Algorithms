#include<stdio.h>

int fib(int n){
  static int n1=0,n2=1,n3;    
    if(n>0){    
         n3 = n1 + n2;    
         n1 = n2;    
         n2 = n3;    
         printf("%d ",n3);    
         fib(n-1);    
    }    
}

void main(){
  int n;
  // Enter here number of times fib number is calculated;
  scanf("%d", &n);
  printf("Fibonacci numbers:");
  printf("%d %d ",0,1);    
  fib(n-2);
}
 
