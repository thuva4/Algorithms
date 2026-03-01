#include "best_first_search.h"
#include <queue>
#include <vector>
#include <algorithm>
#include <map>

struct Node {
    int id;
    int heuristic;
    
    bool operator>(const Node& other) const {
        return heuristic > other.heuristic;
    }
};

std::vector<int> best_first_search(
    int n, 
    const std::vector<std::vector<int>>& adj, 
    int start, 
    int target, 
    const std::vector<int>& heuristic
) {
    std::priority_queue<Node, std::vector<Node>, std::greater<Node>> pq;
    std::vector<bool> visited(n, false);
    std::vector<int> parent(n, -1);
    
    pq.push({start, heuristic[start]});
    visited[start] = true;
    
    bool found = false;
    
    while (!pq.empty()) {
        Node current = pq.top();
        pq.pop();
        int u = current.id;
        
        if (u == target) {
            found = true;
            break;
        }
        
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                parent[v] = u;
                pq.push({v, heuristic[v]});
            }
        }
    }
    
    std::vector<int> path;
    if (found) {
        int curr = target;
        while (curr != -1) {
            path.push_back(curr);
            curr = parent[curr];
        }
        std::reverse(path.begin(), path.end());
    }
    return path;
}

std::vector<int> best_first_search(
    const std::vector<std::vector<int>>& adj,
    int start,
    int target,
    const std::vector<int>& heuristic
) {
    int n = static_cast<int>(adj.size());
    if (n == 0 || start < 0 || start >= n || target < 0 || target >= n) {
        return {};
    }
    if (static_cast<int>(heuristic.size()) < n) {
        return {};
    }
    return best_first_search(n, adj, start, target, heuristic);
}
