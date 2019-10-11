#include <bits/stdc++.h>
#define endl "\n"
#define print_arr(a,n) cout << #a << endl; for (int i=0; i<n; i++) {cout << a[i] << " ";} cout << endl;
#define print(a) cout << #a << ": " << a << endl;
typedef long long ll;
using namespace std;


ll sum(ll tree[], ll k) {
    ll s = 0;
    while (k >= 1) {
        s += tree[k];
        k -= k & (-k);
    }
    return s;
}

void update(ll tree[], ll x, ll k, ll n) {
    ll new_val = x;
    while (k <= n) {
        tree[k] += new_val;
        k += k & (-k);
    }
}

void gen_tree(ll tree[], ll arr[], ll n) {
    for (ll k=1; k <= n; k++) {
        update(tree, arr[k], k, n);
    }
}


int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    ll n, i, j, x;
    n = 8;
    ll arr[n+1] = {0, 1, 3, 4, 8, 6, 1, 4, 2};
    ll tree[n+1] = {0};

    print_arr(tree,n+1);
    gen_tree(tree, arr, n);
    print_arr(tree,n+1);

    return 0;
}