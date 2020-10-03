#include<bits/stdc++.h>

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
	vector<int> prime;
	prime = segmentedSieve(5, 11);
	for(int i: prime) cout << i << " ";
}