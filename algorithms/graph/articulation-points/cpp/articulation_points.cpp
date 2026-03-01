#include "articulation_points.h"
#include <vector>
#include <algorithm>
#include <set>

static std::vector<std::vector<int>> adj;
static std::vector<int> dfn, low;
static std::set<int> ap;
static int timer;

static void dfs(int u, int p = -1) {
    dfn[u] = low[u] = ++timer;
    int children = 0;

    for (int v : adj[u]) {
        if (v == p) continue;
        if (dfn[v]) {
            low[u] = std::min(low[u], dfn[v]);
        } else {
            children++;
            dfs(v, u);
            low[u] = std::min(low[u], low[v]);
            if (p != -1 && low[v] >= dfn[u]) {
                ap.insert(u);
            }
        }
    }

    if (p == -1 && children > 1) {
        ap.insert(u);
    }
}

int articulation_points(const std::vector<int>& arr) {
    if (arr.size() < 2) return 0;
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 2 * m) return 0;

    adj.assign(n, std::vector<int>());
    dfn.assign(n, 0);
    low.assign(n, 0);
    ap.clear();
    timer = 0;

    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
    }

    for (int i = 0; i < n; i++) {
        if (!dfn[i]) dfs(i);
    }

    return ap.size();
}
