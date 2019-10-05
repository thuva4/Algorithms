# include <bits/stdc++.h>

using namespace std;

long long factorial(int n){
	long long p = 1;

	if(n==0 || n==1)
		return p;

	for(int i=2; i<n; i++){
		p *= (long long)i;
	}

	return p;
}

int main(){
	int n;
	cin >> n;
	cout << factorial(n);
}