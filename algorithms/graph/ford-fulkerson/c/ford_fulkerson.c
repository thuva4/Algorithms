#include "ford_fulkerson.h"
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

static int* g_cap_ff;
static int g_n_ff;

static int dfs_ff(int u, int sink, int flow, bool* visited) {
    if (u == sink) return flow;
    visited[u] = true;
    for (int v = 0; v < g_n_ff; v++) {
        if (!visited[v] && g_cap_ff[u*g_n_ff+v] > 0) {
            int f = flow < g_cap_ff[u*g_n_ff+v] ? flow : g_cap_ff[u*g_n_ff+v];
            int d = dfs_ff(v, sink, f, visited);
            if (d > 0) { g_cap_ff[u*g_n_ff+v] -= d; g_cap_ff[v*g_n_ff+u] += d; return d; }
        }
    }
    return 0;
}

int ford_fulkerson(int* arr, int len) {
    g_n_ff = arr[0]; int m = arr[1]; int src = arr[2]; int sink = arr[3];
    g_cap_ff = (int*)calloc(g_n_ff * g_n_ff, sizeof(int));
    for (int i = 0; i < m; i++) g_cap_ff[arr[4+3*i]*g_n_ff + arr[5+3*i]] += arr[6+3*i];
    int maxFlow = 0;
    while (1) {
        bool* visited = (bool*)calloc(g_n_ff, sizeof(bool));
        int flow = dfs_ff(src, sink, INT_MAX, visited);
        free(visited);
        if (flow == 0) break;
        maxFlow += flow;
    }
    free(g_cap_ff);
    return maxFlow;
}
