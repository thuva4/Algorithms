#include "bfs.h"
#include <vector>
#include <queue>
#include <algorithm>

std::vector<int> bfs(const std::vector<int>& arr) {
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
    
    // Sort neighbors for deterministic output
    for (int i = 0; i < n; i++) {
        std::sort(adj[i].begin(), adj[i].end());
    }
    
    std::vector<int> result;
    std::vector<bool> visited(n, false);
    std::queue<int> q;
    
    visited[start] = true;
    q.push(start);
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        result.push_back(u);
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    
    return result;
}
