#include <vector>
#include <queue>
#include <climits>
using namespace std;

int prims_fibonacci_heap(vector<int> arr) {
    int n = arr[0], m = arr[1];
    vector<vector<pair<int,int>>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2+3*i], v = arr[2+3*i+1], w = arr[2+3*i+2];
        adj[u].push_back({w, v});
        adj[v].push_back({w, u});
    }

    vector<bool> inMst(n, false);
    vector<int> key(n, INT_MAX);
    key[0] = 0;
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, 0});
    int total = 0;

    while (!pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();
        if (inMst[u]) continue;
        inMst[u] = true;
        total += w;
        for (auto& [ew, v] : adj[u]) {
            if (!inMst[v] && ew < key[v]) {
                key[v] = ew;
                pq.push({ew, v});
            }
        }
    }

    return total;
}
