#include "bellman_ford.h"
#include <vector>

const int INF = 1000000000;

struct Edge {
    int u, v, w;
};

std::vector<int> bellman_ford(const std::vector<int>& arr) {
    if (arr.size() < 2) return {};
    
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 3 * m + 1) return {};
    
    int start = arr[2 + 3 * m];
    
    if (start < 0 || start >= n) return {};
    
    std::vector<Edge> edges;
    for (int i = 0; i < m; i++) {
        edges.push_back({arr[2 + 3 * i], arr[2 + 3 * i + 1], arr[2 + 3 * i + 2]});
    }
    
    std::vector<int> dist(n, INF);
    dist[start] = 0;
    
    for (int i = 0; i < n - 1; i++) {
        for (const auto& e : edges) {
            if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
                dist[e.v] = dist[e.u] + e.w;
            }
        }
    }
    
    for (const auto& e : edges) {
        if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
            return {}; // Negative cycle
        }
    }
    
    return dist;
}
