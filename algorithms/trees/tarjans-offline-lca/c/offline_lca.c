#include <stdlib.h>

static void build_parent_depth(int n, int adj[128][128], int *deg, int *parent, int *depth) {
    int queue[128];
    int front = 0;
    int back = 0;

    for (int i = 0; i < n; i++) {
        parent[i] = -2;
        depth[i] = 0;
    }
    parent[0] = -1;
    queue[back++] = 0;

    while (front < back) {
        int u = queue[front++];
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u][i];
            if (parent[v] == -2) {
                parent[v] = u;
                depth[v] = depth[u] + 1;
                queue[back++] = v;
            }
        }
    }
}

int *offline_lca(int arr[], int size, int *out_size) {
    int idx = 0;
    int n = size > 0 ? arr[idx++] : 0;
    int adj[128][128];
    int deg[128] = {0};
    int parent[128];
    int depth[128];
    int *result;

    for (int i = 0; i < 128; i++) {
        for (int j = 0; j < 128; j++) {
            adj[i][j] = 0;
        }
    }

    for (int i = 0; i < n - 1 && idx + 1 < size; i++) {
        int u = arr[idx++];
        int v = arr[idx++];
        adj[u][deg[u]++] = v;
        adj[v][deg[v]++] = u;
    }

    build_parent_depth(n, adj, deg, parent, depth);

    *out_size = idx < size ? (size - idx) / 2 : 0;
    result = (int *)malloc((size_t)(*out_size > 0 ? *out_size : 1) * sizeof(int));

    for (int q = 0; q < *out_size; q++) {
        int u = arr[idx++];
        int v = arr[idx++];

        while (depth[u] > depth[v]) u = parent[u];
        while (depth[v] > depth[u]) v = parent[v];
        while (u != v) {
            u = parent[u];
            v = parent[v];
        }
        result[q] = u;
    }

    return result;
}
