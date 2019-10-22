/* Author : Aaryan Srivastava (aaryans941)*/ 
#include <bits/stdc++.h>
#define ff first
#define ss second 
#define all(c) (c).begin(),(c).end()
const int Wmax = 1e5 +5 ;
const int Nmax = 1e2 +5 ; 
using namespace std; 

long long bagvalue[Nmax][Wmax]; // n * W 
int n,W ;
vector<pair<int,int>> items;
long long dp(int w, int cur){
	if(cur == n)
		return 0; 
	long long& ans = bagvalue[cur][w];
	if(ans) return ans;
	ans = max(ans, dp(w,cur+1));
	if((long long)items[cur].ff + w <= W) 
		ans = max(ans, dp(w + items[cur].ff, cur+1) + items[cur].ss);
	return ans ;
}

int main()
{
	// follows format as in : https://atcoder.jp/contests/dp/tasks/dp_d
	cin >> n >> W; 
	items.resize(n);
	for(auto &it : items) cin >> it.ff >> it.ss ;
	sort(all(items));
	cout << dp(0,0);
}   
