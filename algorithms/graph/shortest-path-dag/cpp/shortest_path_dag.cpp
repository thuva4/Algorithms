#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

/**
 * Find shortest path from source to vertex n-1 in a DAG.
 *
 * Input format: [n, m, src, u1, v1, w1, ...]
 * Returns: shortest distance from src to n-1, or -1 if unreachable
 */
int shortestPathDag(const vector<int>& arr) {
    int idx = 0;
    int n = arr[idx++];
    int m = arr[idx++];
    int src = arr[idx++];

    vector<vector<pair<int,int>>> adj(n);
    vector<int> inDegree(n, 0);
    for (int i = 0; i < m; i++) {
        int u = arr[idx++], v = arr[idx++], w = arr[idx++];
        adj[u].push_back({v, w});
        inDegree[v]++;
    }

    queue<int> q;
    for (int i = 0; i < n; i++)
        if (inDegree[i] == 0) q.push(i);

    vector<int> topoOrder;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        topoOrder.push_back(node);
        for (auto& [v, w] : adj[node]) {
            if (--inDegree[v] == 0) q.push(v);
        }
    }

    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    for (int u : topoOrder) {
        if (dist[u] == INT_MAX) continue;
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    return dist[n - 1] == INT_MAX ? -1 : dist[n - 1];
}

int main() {
    cout << shortestPathDag({4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7}) << endl;
    cout << shortestPathDag({3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1}) << endl;
    cout << shortestPathDag({2, 1, 0, 0, 1, 10}) << endl;
    cout << shortestPathDag({3, 1, 0, 1, 2, 5}) << endl;
    return 0;
}
