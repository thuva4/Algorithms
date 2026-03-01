#include "centroid_tree.h"
#include <vector>
#include <algorithm>

static std::vector<std::vector<int>> adj;
static std::vector<int> sz;
static std::vector<bool> removed;
static int max_depth;

static void get_size(int u, int p) {
    sz[u] = 1;
    for (int v : adj[u]) {
        if (v != p && !removed[v]) {
            get_size(v, u);
            sz[u] += sz[v];
        }
    }
}

static int get_centroid(int u, int p, int total) {
    for (int v : adj[u]) {
        if (v != p && !removed[v] && sz[v] > total / 2) {
            return get_centroid(v, u, total);
        }
    }
    return u;
}

static void decompose(int u, int depth) {
    get_size(u, -1);
    int total = sz[u];
    int centroid = get_centroid(u, -1, total);
    
    max_depth = std::max(max_depth, depth);
    
    removed[centroid] = true;
    
    for (int v : adj[centroid]) {
        if (!removed[v]) {
            decompose(v, depth + 1);
        }
    }
}

int centroid_tree(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int n = arr[0];
    
    if (n <= 1) return 0;
    if (arr.size() < 1 + 2 * (n - 1)) return 0;
    
    adj.assign(n, std::vector<int>());
    sz.assign(n, 0);
    removed.assign(n, false);
    max_depth = 0;
    
    for (int i = 0; i < n - 1; i++) {
        int u = arr[1 + 2 * i];
        int v = arr[1 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }
    
    decompose(0, 0);
    
    return max_depth;
}
