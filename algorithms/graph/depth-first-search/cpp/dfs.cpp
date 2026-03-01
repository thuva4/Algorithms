#include "dfs.h"
#include <vector>
#include <algorithm>

static void dfs_recursive(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited, std::vector<int>& result) {
    visited[u] = true;
    result.push_back(u);
    
    for (int v : adj[u]) {
        if (!visited[v]) {
            dfs_recursive(v, adj, visited, result);
        }
    }
}

std::vector<int> dfs(const std::vector<int>& arr) {
    if (arr.size() < 2) return {};
    
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 2 * m + 1) return {};
    
    int start = arr[2 + 2 * m];
    if (start < 0 || start >= n) return {};
    
    std::vector<std::vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }
    
    for (int i = 0; i < n; i++) {
        std::sort(adj[i].begin(), adj[i].end());
    }
    
    std::vector<int> result;
    std::vector<bool> visited(n, false);
    
    dfs_recursive(start, adj, visited, result);
    
    return result;
}
