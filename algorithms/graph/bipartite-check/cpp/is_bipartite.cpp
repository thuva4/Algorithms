#include <vector>
#include <queue>
using namespace std;

int is_bipartite(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    vector<vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    vector<int> color(n, -1);

    for (int start = 0; start < n; start++) {
        if (color[start] != -1) continue;
        color[start] = 0;
        queue<int> q;
        q.push(start);
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : adj[u]) {
                if (color[v] == -1) {
                    color[v] = 1 - color[u];
                    q.push(v);
                } else if (color[v] == color[u]) {
                    return 0;
                }
            }
        }
    }

    return 1;
}
