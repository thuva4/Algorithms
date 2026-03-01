#include "bipartite_matching.h"
#include <vector>
#include <queue>
#include <limits.h>

static int n_left, n_right;
static std::vector<std::vector<int>> adj;
static std::vector<int> pair_u, pair_v, dist;

static bool bfs() {
    std::queue<int> q;
    for (int u = 0; u < n_left; u++) {
        if (pair_u[u] == -1) {
            dist[u] = 0;
            q.push(u);
        } else {
            dist[u] = INT_MAX;
        }
    }
    
    dist[n_left] = INT_MAX;
    
    while (!q.empty()) {
        int u = q.front();
        q.pop();
        
        if (dist[u] < dist[n_left]) {
            for (int v : adj[u]) {
                int pu = pair_v[v];
                if (pu == -1) {
                    if (dist[n_left] == INT_MAX) {
                        dist[n_left] = dist[u] + 1;
                    }
                } else if (dist[pu] == INT_MAX) {
                    dist[pu] = dist[u] + 1;
                    q.push(pu);
                }
            }
        }
    }
    
    return dist[n_left] != INT_MAX;
}

static bool dfs(int u) {
    if (u != -1) {
        for (int v : adj[u]) {
            int pu = pair_v[v];
            if (pu == -1 || (dist[pu] == dist[u] + 1 && dfs(pu))) {
                pair_v[v] = u;
                pair_u[u] = v;
                return true;
            }
        }
        dist[u] = INT_MAX;
        return false;
    }
    return true;
}

int hopcroft_karp(const std::vector<int>& arr) {
    if (arr.size() < 3) return 0;
    
    n_left = arr[0];
    n_right = arr[1];
    int m = arr[2];
    
    if (arr.size() < 3 + 2 * m) return 0;
    if (n_left == 0 || n_right == 0) return 0;
    
    adj.assign(n_left, std::vector<int>());
    for (int i = 0; i < m; i++) {
        int u = arr[3 + 2 * i];
        int v = arr[3 + 2 * i + 1];
        if (u >= 0 && u < n_left && v >= 0 && v < n_right) {
            adj[u].push_back(v);
        }
    }
    
    pair_u.assign(n_left, -1);
    pair_v.assign(n_right, -1);
    dist.assign(n_left + 1, 0);
    
    int matching = 0;
    while (bfs()) {
        for (int u = 0; u < n_left; u++) {
            if (pair_u[u] == -1 && dfs(u)) {
                matching++;
            }
        }
    }
    
    return matching;
}
