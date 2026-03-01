#include <vector>
using namespace std;

static vector<vector<int>> adj;
static vector<int> colors;
static int n_vertices;

static bool isSafe(int v, int c) {
    for (int u : adj[v]) {
        if (colors[u] == c) return false;
    }
    return true;
}

static bool solve(int v, int k) {
    if (v == n_vertices) return true;
    for (int c = 1; c <= k; c++) {
        if (isSafe(v, c)) {
            colors[v] = c;
            if (solve(v + 1, k)) return true;
            colors[v] = 0;
        }
    }
    return false;
}

int chromatic_number(vector<int> arr) {
    n_vertices = arr[0];
    int m = arr[1];
    if (n_vertices == 0) return 0;
    if (m == 0) return 1;

    adj.assign(n_vertices, vector<int>());
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u].push_back(v);
        adj[v].push_back(u);
    }

    for (int k = 1; k <= n_vertices; k++) {
        colors.assign(n_vertices, 0);
        if (solve(0, k)) return k;
    }
    return n_vertices;
}
