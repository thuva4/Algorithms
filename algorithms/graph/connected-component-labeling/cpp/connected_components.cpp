#include "connected_components.h"
#include <vector>
#include <queue>
#include <algorithm>

std::vector<int> connected_components(const std::vector<int>& arr) {
    if (arr.size() < 2) return {};
    
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 2 * m) return {};
    if (n == 0) return {};
    
    std::vector<std::vector<int>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }
    
    std::vector<int> labels(n, -1);
    std::queue<int> q;
    
    for (int i = 0; i < n; i++) {
        if (labels[i] == -1) {
            int component_id = i;
            labels[i] = component_id;
            q.push(i);
            
            while (!q.empty()) {
                int u = q.front();
                q.pop();
                
                for (int v : adj[u]) {
                    if (labels[v] == -1) {
                        labels[v] = component_id;
                        q.push(v);
                    }
                }
            }
        }
    }
    
    return labels;
}
