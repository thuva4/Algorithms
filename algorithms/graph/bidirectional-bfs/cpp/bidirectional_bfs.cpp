#include "bidirectional_bfs.h"
#include <vector>
#include <queue>
#include <algorithm>

int bidirectional_bfs(const std::vector<int>& arr) {
    if (arr.size() < 4) return -1;
    
    int n = arr[0];
    int m = arr[1];
    int start = arr[2];
    int end = arr[3];
    
    if (arr.size() < 4 + 2 * m) return -1;
    if (start == end) return 0;
    
    std::vector<std::vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[4 + 2 * i];
        int v = arr[4 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }
    
    std::vector<int> dist_start(n, -1);
    std::vector<int> dist_end(n, -1);
    
    std::queue<int> q_start, q_end;
    
    q_start.push(start);
    dist_start[start] = 0;
    
    q_end.push(end);
    dist_end[end] = 0;
    
    while (!q_start.empty() && !q_end.empty()) {
        // Expand start
        int u = q_start.front();
        q_start.pop();
        
        if (dist_end[u] != -1) return dist_start[u] + dist_end[u];
        
        for (int v : adj[u]) {
            if (dist_start[v] == -1) {
                dist_start[v] = dist_start[u] + 1;
                if (dist_end[v] != -1) return dist_start[v] + dist_end[v];
                q_start.push(v);
            }
        }
        
        // Expand end
        u = q_end.front();
        q_end.pop();
        
        if (dist_start[u] != -1) return dist_start[u] + dist_end[u];
        
        for (int v : adj[u]) {
            if (dist_end[v] == -1) {
                dist_end[v] = dist_end[u] + 1;
                if (dist_start[v] != -1) return dist_start[v] + dist_end[v];
                q_end.push(v);
            }
        }
    }
    
    return -1;
}
