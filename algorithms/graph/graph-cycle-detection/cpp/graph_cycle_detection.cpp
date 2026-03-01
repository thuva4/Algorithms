#include <vector>
using namespace std;

static bool dfs_gcd(int v, vector<vector<int>>& adj, vector<int>& color) {
    color[v] = 1;
    for (int w : adj[v]) {
        if (color[w] == 1) return true;
        if (color[w] == 0 && dfs_gcd(w, adj, color)) return true;
    }
    color[v] = 2;
    return false;
}

int graph_cycle_detection(vector<int> arr) {
    int n = arr[0], m = arr[1];
    vector<vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        adj[arr[2 + 2 * i]].push_back(arr[2 + 2 * i + 1]);
    }
    vector<int> color(n, 0);
    for (int v = 0; v < n; v++) {
        if (color[v] == 0 && dfs_gcd(v, adj, color)) return 1;
    }
    return 0;
}
