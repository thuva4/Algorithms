#include <iostream>
#include <vector>
using namespace std;

int par[10001], rnk[10001];

int find(int x) {
    while (par[x] != x) { par[x] = par[par[x]]; x = par[x]; }
    return x;
}

bool unite(int x, int y) {
    int rx = find(x), ry = find(y);
    if (rx == ry) return false;
    if (rnk[rx] < rnk[ry]) swap(rx, ry);
    par[ry] = rx;
    if (rnk[rx] == rnk[ry]) rnk[rx]++;
    return true;
}

/**
 * Find the minimum spanning tree using Boruvka's algorithm.
 *
 * Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
 * Returns: total weight of the MST
 */
int minimumSpanningTreeBoruvka(const vector<int>& arr) {
    int idx = 0;
    int n = arr[idx++];
    int m = arr[idx++];
    vector<int> eu(m), ev(m), ew(m);
    for (int i = 0; i < m; i++) {
        eu[i] = arr[idx++];
        ev[i] = arr[idx++];
        ew[i] = arr[idx++];
    }

    for (int i = 0; i < n; i++) { par[i] = i; rnk[i] = 0; }

    int totalWeight = 0;
    int numComponents = n;

    while (numComponents > 1) {
        vector<int> cheapest(n, -1);

        for (int i = 0; i < m; i++) {
            int ru = find(eu[i]), rv = find(ev[i]);
            if (ru == rv) continue;
            if (cheapest[ru] == -1 || ew[i] < ew[cheapest[ru]])
                cheapest[ru] = i;
            if (cheapest[rv] == -1 || ew[i] < ew[cheapest[rv]])
                cheapest[rv] = i;
        }

        for (int node = 0; node < n; node++) {
            if (cheapest[node] != -1) {
                if (unite(eu[cheapest[node]], ev[cheapest[node]])) {
                    totalWeight += ew[cheapest[node]];
                    numComponents--;
                }
            }
        }
    }

    return totalWeight;
}

int main() {
    cout << minimumSpanningTreeBoruvka({3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3}) << endl;
    cout << minimumSpanningTreeBoruvka({4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4}) << endl;
    cout << minimumSpanningTreeBoruvka({2, 1, 0, 1, 7}) << endl;
    cout << minimumSpanningTreeBoruvka({4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3}) << endl;
    return 0;
}
