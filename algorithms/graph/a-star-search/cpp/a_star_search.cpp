#include "a_star_search.h"
#include <vector>
#include <queue>
#include <limits.h>

struct Node {
    int id;
    int f, g;
    
    bool operator>(const Node& other) const {
        return f > other.f;
    }
};

struct Edge {
    int to;
    int weight;
};

int a_star_search(const std::vector<int>& arr) {
    if (arr.size() < 2) return -1;
    
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 3 * m + 2 + n) return -1;
    
    int start = arr[2 + 3 * m];
    int goal = arr[2 + 3 * m + 1];
    
    if (start < 0 || start >= n || goal < 0 || goal >= n) return -1;
    if (start == goal) return 0;
    
    std::vector<std::vector<Edge>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 3 * i];
        int v = arr[2 + 3 * i + 1];
        int w = arr[2 + 3 * i + 2];
        
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back({v, w});
        }
    }
    
    const int* h = &arr[2 + 3 * m + 2];
    
    std::priority_queue<Node, std::vector<Node>, std::greater<Node>> openSet;
    std::vector<int> gScore(n, INT_MAX);
    
    gScore[start] = 0;
    openSet.push({start, h[start], 0});
    
    while (!openSet.empty()) {
        Node current = openSet.top();
        openSet.pop();
        int u = current.id;
        
        if (u == goal) return current.g;
        
        if (current.g > gScore[u]) continue;
        
        for (const auto& e : adj[u]) {
            int v = e.to;
            int w = e.weight;
            
            if (gScore[u] != INT_MAX && gScore[u] + w < gScore[v]) {
                gScore[v] = gScore[u] + w;
                openSet.push({v, gScore[v] + h[v], gScore[v]});
            }
        }
    }
    
    return -1;
}
