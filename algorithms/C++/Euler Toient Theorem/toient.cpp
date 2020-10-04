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
	cout << "Testing phi: " << "\n";
	int t;
	cin >> t;
	vector<int> v(t);
	for(int i=0; i<t; i++){
		int num;
		cin >> num;
		v[i] = num;
	}
	for(int i:v) cout << "phi(" << i << "): " << phi(i) << "\n";
	

	cout << "\n";
	cout << "Testing phi_1ton: " << "\n";
	for(int i:phi_1ton(t)) cout << i << " ";
}