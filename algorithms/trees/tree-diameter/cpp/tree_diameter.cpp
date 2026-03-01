#include <iostream>
#include <vector>
#include <queue>
using namespace std;

pair<int,int> bfs(int start, int n, const vector<vector<int>>& adj) {
    vector<int> dist(n, -1);
    dist[start] = 0;
    queue<int> q;
    q.push(start);
    int farthest = start;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        for (int nb : adj[node]) {
            if (dist[nb] == -1) {
                dist[nb] = dist[node] + 1;
                q.push(nb);
                if (dist[nb] > dist[farthest]) farthest = nb;
            }
        }
    }
    return {farthest, dist[farthest]};
}

int treeDiameter(const vector<int>& arr) {
    int idx = 0;
    int n = arr[idx++];
    if (n <= 1) return 0;

    vector<vector<int>> adj(n);
    int m = ((int)arr.size() - 1) / 2;
    for (int i = 0; i < m; i++) {
        int u = arr[idx++], v = arr[idx++];
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    auto [u, d1] = bfs(0, n, adj);
    auto [v, diameter] = bfs(u, n, adj);
    return diameter;
}

int main() {
    cout << treeDiameter({4, 0, 1, 1, 2, 2, 3}) << endl;
    cout << treeDiameter({5, 0, 1, 0, 2, 0, 3, 0, 4}) << endl;
    cout << treeDiameter({2, 0, 1}) << endl;
    cout << treeDiameter({1}) << endl;
    return 0;
}
