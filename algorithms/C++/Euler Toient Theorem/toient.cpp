#include<bits/stdc++.h>

using namespace std;

// O(sqrtN)
// what we are doind is -> result = result*(1-1/p)
int phi(int n){
	int result = n;
	for(int i=2; i*i<=n; i++){
		if(n%i == 0){
			while(n%i == 0){
				n = n/i;
			}
			result -= result/i;
		}
	}
	if(n>1)
		result -= result/n;
	return result;
}

//Euler's Toient Function from 1 to n
vector<int> phi_1ton(int n){
	vector<int> phi(n+1);
	for(int i=0; i<=n; i++){
		phi[i] = i;
	}
	for(int i=2; i<n; i++){
		if(phi[i] = i){
			for(int j=i; j<=n; j++){
				phi[j] -= phi[j]/i;
			}
		}
	}
	return phi;
}


int main(){
	int n;
	cin >> n;
	cout << phi(n) << endl;
}