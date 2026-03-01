#include <vector>
#include <queue>
#include <climits>

using namespace std;

int spfa(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    int src = arr[2];
    vector<vector<pair<int,int>>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[3 + 3 * i];
        int v = arr[3 + 3 * i + 1];
        int w = arr[3 + 3 * i + 2];
        adj[u].push_back({v, w});
    }

    int INF = INT_MAX / 2;
    vector<int> dist(n, INF);
    dist[src] = 0;
    vector<bool> inQueue(n, false);
    queue<int> q;
    q.push(src);
    inQueue[src] = true;

    while (!q.empty()) {
        int u = q.front(); q.pop();
        inQueue[u] = false;
        for (auto& [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!inQueue[v]) {
                    q.push(v);
                    inQueue[v] = true;
                }
            }
        }
    }

    return dist[n - 1] == INF ? -1 : dist[n - 1];
}
