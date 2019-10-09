#include <bits/stdc++.h>
#define ll long long
using namespace std;

//Sieve of Eratosthenes. Time Complexity O(n log log n).
vector<bool> sieve(ll n){
	vector<bool> isP(n+1, true);
	isP[0]=isP[1]=false;
	for(ll i=2; i<=n/2; i++) isP[2*i]=false;
	for(ll i=3; i*i<=n; i+=2){
		if(isP[i])
			for(int j=i*i; j<=n; j+=i) isP[j]=false;
	}
	return isP;
}

ll p(int n){
  if(n==1) return 2;
  else if(n==2) return 3;
  else if(n==3) return 5;
  else if(n==4) return 7;
  else if(n==5) return 11;
  double lg=log(n);
  double lg_=log(lg);
  ll k=n*ceil(lg+lg_);
  //see https://math.stackexchange.com/questions/1270814/bounds-for-n-th-prime
  vector<bool> isP=sieve(k);
  ll c=0, i=0;
  while(c<n){
    if(isP[i]) c++;
    i++;
  }
  return i-1;
}

//Total time complexity O(n log n)?

int main(){
    ll n;
    cout<<"Enter n: ";
    cin>>n;
    cout<<"p("<<n<<") = "<<p(n);
    return 0;
}
