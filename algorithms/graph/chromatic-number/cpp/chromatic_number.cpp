#include "chromatic_number.h"
#include <vector>

static bool is_safe(int u, int c, int n, const std::vector<int>& color, const std::vector<std::vector<bool>>& adj) {
    for (int v = 0; v < n; v++) {
        if (adj[u][v] && color[v] == c) {
            return false;
        }
    }
    return true;
}

static bool graph_coloring_util(int u, int n, int k, std::vector<int>& color, const std::vector<std::vector<bool>>& adj) {
    if (u == n) return true;

    for (int c = 1; c <= k; c++) {
        if (is_safe(u, c, n, color, adj)) {
            color[u] = c;
            if (graph_coloring_util(u + 1, n, k, color, adj)) {
                return true;
            }
            color[u] = 0;
        }
    }
    return false;
}

int chromatic_number(const std::vector<int>& arr) {
    if (arr.size() < 2) return 0;
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 2 * m) return 0;
    if (n == 0) return 0;
    
    std::vector<std::vector<bool>> adj(n, std::vector<bool>(n, false));
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u][v] = adj[v][u] = true;
        }
    }
    
    std::vector<int> color(n, 0);
    
    for (int k = 1; k <= n; k++) {
        if (graph_coloring_util(0, n, k, color, adj)) {
            return k;
        }
    }
    
    return n;
}
