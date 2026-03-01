#include "dijkstra.h"
#include <vector>
#include <queue>
#include <limits.h>

const int INF = 1000000000;

struct Edge {
    int to;
    int weight;
};

struct PQNode {
    int u;
    int d;
    
    bool operator>(const PQNode& other) const {
        return d > other.d;
    }
};

std::vector<int> dijkstra(const std::vector<int>& arr) {
    if (arr.size() < 2) return {};
    
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 3 * m + 1) return {};
    
    int start = arr[2 + 3 * m];
    if (start < 0 || start >= n) return {};
    
    std::vector<std::vector<Edge>> adj(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 3 * i];
        int v = arr[2 + 3 * i + 1];
        int w = arr[2 + 3 * i + 2];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back({v, w});
        }
    }
    
    std::vector<int> dist(n, INF);
    dist[start] = 0;
    
    std::priority_queue<PQNode, std::vector<PQNode>, std::greater<PQNode>> pq;
    pq.push({start, 0});
    
    while (!pq.empty()) {
        PQNode current = pq.top();
        pq.pop();
        
        int u = current.u;
        int d = current.d;
        
        if (d > dist[u]) continue;
        
        for (const auto& e : adj[u]) {
            if (dist[u] + e.weight < dist[e.to]) {
                dist[e.to] = dist[u] + e.weight;
                pq.push({e.to, dist[e.to]});
            }
        }
    }
    
    return dist;
}
