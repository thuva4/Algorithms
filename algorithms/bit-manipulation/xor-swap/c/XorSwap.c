#include <stdio.h>

void xorSwap (int *x, int *y) {
     if (x != y) {
         *x ^= *y;
         *y ^= *x;
         *x ^= *y;
     }
 }

int main(){
	int a,b;
	 a=10; 
	 b=45;

	printf("Values before Swap\n a=%d,b=%d\n",a,b);
	xorSwap(&a,&b);
	printf("Values after Swap\n a=%d,b=%d\n",a,b);
}
