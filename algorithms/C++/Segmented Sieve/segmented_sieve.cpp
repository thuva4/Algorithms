#include<bits/stdc++.h>
#define take_input freopen("input.txt", "r", stdin)
using namespace std;

template<typename T>
vector<T> segmentedSieve(T l, T r){
	vector<bool> isPrime(r-l+1, true);
	for(long long int i=2; i*i<=r; i++){
		for(long long int j=max(i*i, ((l+i-1)/i)*i); j<=r; j+=i){
			isPrime[j-l] = false;
		}
	}
	vector<T> primes;
	for(long long int i=max(l, 2); i<=r; i++){
		if(isPrime[i-l]){
			primes.push_back(i);
		}
	}
	return primes;
}

int main(){
	take_input;
	int a,b;
	cin >> a >> b;
	vector<int> prime;
	prime = segmentedSieve(a, b);
	cout << "Printing all the primes from " <<a << " to " <<b <<" :" << "\n";
	for(int i: prime) cout << i << " ";
	cout << "\n";
}