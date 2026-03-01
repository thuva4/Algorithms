#include "graph_cycle_detection.h"
#include <string.h>

#define MAX_V 1000
static int adj[MAX_V][MAX_V], adj_count[MAX_V], color[MAX_V];

static int dfs(int v) {
    color[v] = 1;
    for (int i = 0; i < adj_count[v]; i++) {
        int w = adj[v][i];
        if (color[w] == 1) return 1;
        if (color[w] == 0 && dfs(w)) return 1;
    }
    color[v] = 2;
    return 0;
}

int graph_cycle_detection(int arr[], int size) {
    int n = arr[0], m = arr[1];
    memset(adj_count, 0, sizeof(int) * n);
    memset(color, 0, sizeof(int) * n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
        adj[u][adj_count[u]++] = v;
    }
    for (int v = 0; v < n; v++) {
        if (color[v] == 0 && dfs(v)) return 1;
    }
    return 0;
}
