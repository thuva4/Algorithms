#include "kosarajus_scc.h"
#include <string.h>

#define MAX_V 1000
#define MAX_E 10000

static int adj[MAX_V][MAX_V], radj[MAX_V][MAX_V];
static int adj_cnt[MAX_V], radj_cnt[MAX_V];
static int visited[MAX_V];
static int order[MAX_V], order_top;

static void dfs1(int v) {
    visited[v] = 1;
    for (int i = 0; i < adj_cnt[v]; i++) {
        int w = adj[v][i];
        if (!visited[w]) dfs1(w);
    }
    order[order_top++] = v;
}

static void dfs2(int v) {
    visited[v] = 1;
    for (int i = 0; i < radj_cnt[v]; i++) {
        int w = radj[v][i];
        if (!visited[w]) dfs2(w);
    }
}

int kosarajus_scc(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];

    memset(adj_cnt, 0, sizeof(int) * n);
    memset(radj_cnt, 0, sizeof(int) * n);
    memset(visited, 0, sizeof(int) * n);
    order_top = 0;

    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u][adj_cnt[u]++] = v;
        radj[v][radj_cnt[v]++] = u;
    }

    for (int v = 0; v < n; v++) {
        if (!visited[v]) dfs1(v);
    }

    memset(visited, 0, sizeof(int) * n);
    int scc_count = 0;

    for (int i = order_top - 1; i >= 0; i--) {
        int v = order[i];
        if (!visited[v]) {
            dfs2(v);
            scc_count++;
        }
    }

    return scc_count;
}
