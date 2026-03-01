#include <iostream>
#include <vector>
#include <queue>
using namespace std;

int lowestCommonAncestor(const vector<int>& arr) {
    int idx = 0;
    int n = arr[idx++];
    int root = arr[idx++];

    vector<vector<int>> adj(n);
    for (int i = 0; i < n - 1; i++) {
        int u = arr[idx++], v = arr[idx++];
        adj[u].push_back(v); adj[v].push_back(u);
    }
    int qa = arr[idx++], qb = arr[idx++];

    int LOG = 1;
    while ((1 << LOG) < n) LOG++;

    vector<int> depth(n, 0);
    vector<vector<int>> up(LOG, vector<int>(n, -1));

    vector<bool> visited(n, false);
    visited[root] = true;
    up[0][root] = root;
    queue<int> q;
    q.push(root);
    while (!q.empty()) {
        int v = q.front(); q.pop();
        for (int u : adj[v]) {
            if (!visited[u]) {
                visited[u] = true;
                depth[u] = depth[v] + 1;
                up[0][u] = v;
                q.push(u);
            }
        }
    }

    for (int k = 1; k < LOG; k++)
        for (int v = 0; v < n; v++)
            up[k][v] = up[k-1][up[k-1][v]];

    int a = qa, b = qb;
    if (depth[a] < depth[b]) swap(a, b);
    int diff = depth[a] - depth[b];
    for (int k = 0; k < LOG; k++)
        if ((diff >> k) & 1) a = up[k][a];
    if (a == b) return a;
    for (int k = LOG - 1; k >= 0; k--)
        if (up[k][a] != up[k][b]) { a = up[k][a]; b = up[k][b]; }
    return up[0][a];
}

int main() {
    cout << lowestCommonAncestor({5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2}) << endl;
    cout << lowestCommonAncestor({5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3}) << endl;
    cout << lowestCommonAncestor({3, 0, 0, 1, 0, 2, 2, 2}) << endl;
    cout << lowestCommonAncestor({5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4}) << endl;
    return 0;
}
