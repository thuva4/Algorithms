#include <stdlib.h>

static int find_path(int n, int *adj, int *deg, int start, int target, int *parent) {
    int queue[512];
    int front = 0;
    int back = 0;

    for (int i = 0; i < n; i++) {
        parent[i] = -2;
    }
    parent[start] = -1;
    queue[back++] = start;

    while (front < back) {
        int u = queue[front++];
        if (u == target) return 1;
        for (int i = 0; i < deg[u]; i++) {
            int v = adj[u * n + i];
            if (parent[v] == -2) {
                parent[v] = u;
                queue[back++] = v;
            }
        }
    }

    return 0;
}

int *hld_path_query(int arr[], int size, int *out_size) {
    int n;
    int idx = 0;
    int *result;
    int adj[256];
    int deg[16];
    int parent[16];

    if (size <= 0) {
        *out_size = 0;
        return (int *)calloc(1, sizeof(int));
    }

    n = arr[idx++];
    for (int i = 0; i < n * n; i++) adj[i] = 0;
    for (int i = 0; i < n; i++) deg[i] = 0;

    for (int i = 0; i < n - 1 && idx + 1 < size; i++) {
        int u = arr[idx++];
        int v = arr[idx++];
        adj[u * n + deg[u]++] = v;
        adj[v * n + deg[v]++] = u;
    }

    int *values = &arr[idx];
    idx += n;

    int query_count = 0;
    if (idx < size) {
        query_count = (size - idx) / 3;
    }

    result = (int *)malloc((size_t)(query_count > 0 ? query_count : 1) * sizeof(int));

    for (int q = 0; q < query_count; q++) {
        int type = arr[idx++];
        int u = arr[idx++];
        int v = arr[idx++];
        int path[32];
        int path_len = 0;
        int current;

        find_path(n, adj, deg, u, v, parent);
        current = v;
        while (current != -1 && current != -2) {
            path[path_len++] = current;
            current = parent[current];
        }

        if (type == 1) {
            int sum = 0;
            for (int i = 0; i < path_len; i++) sum += values[path[i]];
            result[q] = sum;
        } else {
            int best = values[path[0]];
            for (int i = 1; i < path_len; i++) {
                if (values[path[i]] > best) best = values[path[i]];
            }
            result[q] = best;
        }
    }

    *out_size = query_count;
    return result;
}
