/*fibonacci series
recursive and non-recursive
*/

#include <stdio.h>

//function declaration
int fibo(int n);
int nonRecFibo(int n);

int main(){
	//variable declaration
	int n, f;
	
	//input
	printf("Enter n: ");
	scanf("%d", &n);
	
	//recursive
	f = fibo(n);
	printf("Recursive Fibo: %d\n", f);
	
	//non-recursive
	f = nonRecFibo(n);
	printf("Non-Recursive Fibo: %d\n", f);
	
	return 0;
}

//function definition
int fibo(int n){
	if(n <= 1)
		return n;
	else
		return fibo(n-1) + fibo(n-2);
}

int nonRecFibo(int n){
	int i, a, b, f;
	if(n <= 1)
		return n;
	else{
		a = 0, b = 1, f = 0;
		for(i = 2; i <= n; i++){
			f = a + b;
			a = b;
			b = f;
		}
	}
	return f;
}
