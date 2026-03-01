#include "bipartite_check.h"
#include <vector>
#include <queue>

int is_bipartite(const std::vector<int>& arr) {
    if (arr.size() < 2) return 0;
    
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 2 * m) return 0;
    if (n == 0) return 1;
    
    std::vector<std::vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }
    
    std::vector<int> color(n, 0); // 0: none, 1: red, -1: blue
    std::queue<int> q;
    
    for (int i = 0; i < n; i++) {
        if (color[i] == 0) {
            color[i] = 1;
            q.push(i);
            
            while (!q.empty()) {
                int u = q.front();
                q.pop();
                
                for (int v : adj[u]) {
                    if (color[v] == 0) {
                        color[v] = -color[u];
                        q.push(v);
                    } else if (color[v] == color[u]) {
                        return 0;
                    }
                }
            }
        }
    }
    
    return 1;
}
