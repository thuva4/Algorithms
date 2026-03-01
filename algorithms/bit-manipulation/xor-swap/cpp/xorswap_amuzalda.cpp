#include <bits/stdc++.h>

using namespace std;

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

	 cout<<"values before swap :\n";
	 cout<<"a = "<<a<<endl;
	 cout<<"b = "<<b<<endl;

	 xorSwap(&a,&b);

	  cout<<"values after swap :\n";

	 cout<<"a = "<<a<<endl;
	 cout<<"b = "<<b;
}