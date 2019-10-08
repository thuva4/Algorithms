#include <iostream>
using namespace std;

#define ll long long int 

ll knapsack(int W, ll wt[], ll val[], int n) {
    int i,w;
    ll K[n+1][W+1];
    for(i=0; i<=n; i++) {
        for(w=0; w<=W; w++) {
            if(i == 0 || w == 0)
                K[i][w] = 0;
            else if(wt[i-1] <= w) 
                K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w]);
            else 
                K[i][w] = K[i-1][w];
        }
    }
    
    return K[n][W];
}

int main() {
    int i,j;
    int W;   // Knapsack of capacity W
    int n; // Total number of items
    cin >> W;
    cin >> n;
    ll val[n+1], wt[n+1];
    for(i = 0; i < n; i++) {
        cin >> val[i];
    }
    for(i = 0; i < n; i++) {
        cin >> wt[i];
    }
    ll total_value = knapsack(W, wt, val, n);
    cout << total_value << endl;
    return 0;
}