#include "strongly_connected_path_based.h"
#include <string.h>

#define MAX_V 1000
static int adj[MAX_V][MAX_V], adj_count[MAX_V];
static int preorder[MAX_V], s_stack[MAX_V], p_stack[MAX_V];
static int assigned[MAX_V];
static int counter_g, scc_count_g, s_top, p_top;

static void dfs(int v) {
    preorder[v] = counter_g++;
    s_stack[s_top++] = v;
    p_stack[p_top++] = v;

    for (int i = 0; i < adj_count[v]; i++) {
        int w = adj[v][i];
        if (preorder[w] == -1) {
            dfs(w);
        } else if (!assigned[w]) {
            while (p_top > 0 && preorder[p_stack[p_top - 1]] > preorder[w]) p_top--;
        }
    }

    if (p_top > 0 && p_stack[p_top - 1] == v) {
        p_top--;
        scc_count_g++;
        while (1) {
            int u = s_stack[--s_top];
            assigned[u] = 1;
            if (u == v) break;
        }
    }
}

int strongly_connected_path_based(int arr[], int size) {
    int n = arr[0], m = arr[1];
    memset(adj_count, 0, sizeof(int) * n);
    memset(preorder, -1, sizeof(int) * n);
    memset(assigned, 0, sizeof(int) * n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
        adj[u][adj_count[u]++] = v;
    }
    counter_g = 0; scc_count_g = 0; s_top = 0; p_top = 0;
    for (int v = 0; v < n; v++) {
        if (preorder[v] == -1) dfs(v);
    }
    return scc_count_g;
}
