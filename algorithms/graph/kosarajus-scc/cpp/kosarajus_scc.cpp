#include <vector>
using namespace std;

static void dfs1(int v, vector<vector<int>>& adj, vector<bool>& visited, vector<int>& order) {
    visited[v] = true;
    for (int w : adj[v]) {
        if (!visited[w]) dfs1(w, adj, visited, order);
    }
    order.push_back(v);
}

static void dfs2(int v, vector<vector<int>>& radj, vector<bool>& visited) {
    visited[v] = true;
    for (int w : radj[v]) {
        if (!visited[w]) dfs2(w, radj, visited);
    }
}

int kosarajus_scc(vector<int> arr) {
    int n = arr[0];
    int m = arr[1];
    vector<vector<int>> adj(n), radj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u].push_back(v);
        radj[v].push_back(u);
    }

    vector<bool> visited(n, false);
    vector<int> order;

    for (int v = 0; v < n; v++) {
        if (!visited[v]) dfs1(v, adj, visited, order);
    }

    fill(visited.begin(), visited.end(), false);
    int sccCount = 0;

    for (int i = (int)order.size() - 1; i >= 0; i--) {
        int v = order[i];
        if (!visited[v]) {
            dfs2(v, radj, visited);
            sccCount++;
        }
    }

    return sccCount;
}
