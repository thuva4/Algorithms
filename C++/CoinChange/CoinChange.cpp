#include <bits/stdc++.h>
#define endl "\n"
#define loop(i,n) for(ll i=0; i<n; i++)
typedef long long ll;
using namespace std;

#define INF 1e6
vector<int> coins;
bool *ready;
int *value;
int *countof;


int num_coins_recursive(int x) {
    if (x < 0)  return INF;
    if (x == 0) return 0;
    if (ready[x])   return value[x];

    int best = INF;
    for (auto c: coins) {
        best = min(best, num_coins_recursive(x - c) + 1);
    }

    value[x] = best;
    ready[x] = true;
    return best;
}


int num_coins_iterative(int x) {
    value[0] = 0;
    for (int i=1; i <= x; i++) {
        value[i] = INF;
        for (auto c: coins) {
            if (i-c >= 0)
                value[i] = min(value[i], value[i - c] + 1);
        }
    }
    return value[x];
}


int num_ways(int x) {
    countof[0] = 1;
    for (int i=1; i<=x; i++) {
        countof[i] = 0;
        for (auto c: coins) {
            if (i-c >= 0)
                countof[i] += countof[i-c];
        }
    }
    return countof[x];
}


int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    vector<int> c = {1, 3, 4};
    int sum = 5;
    
    coins = c;
    ready = new bool[23];
    value = new int[23];
    countof = new int[23];

    cout << "Number of coins needed: " << num_coins_recursive(sum) << endl;
    cout << "Number of coins needed: " << num_coins_iterative(sum) << endl;
    cout << "Number of ways: " << num_ways(sum) << endl;

    for (int i=0; i<=sum; i++) {
        cout << "Count of " << i << ": " << countof[i] << endl; 
    }
    return 0;
}
