/* Author : Aaryan Srivastava (aaryans941) */ 
#include <bits/stdc++.h>
#define ff first
#define ss second
using namespace std; 
const int N = 1e5 + 5;

vector<int> bagsize(N,0); 
int main()
{
	// follows format as given in : https://atcoder.jp/contests/dp/tasks/dp_d
	int n,w ;
	cin >> n >> w; 
	vector<pair<int,int>> items(n);
	for(auto &it : items) cin >> it.ff >> it.ss ;
	sort(items.begin() , items.end());
	for(auto it : items){
		for(int i = w; i >= 0 ; --i){
			if(i + it.ff > w) continue ;
			bagsize[i + it.ff] = max(bagsize[i+it.ff], bagsize[i] + it.ss);
		}
	}

	cout << *max_element(bagsize.begin() , bagsize.end());
}   

     