#include <stdlib.h>

int *prufer_encode(int arr[], int size, int *out_size) {
    int idx = 0;
    int n = size > 0 ? arr[idx++] : 0;
    int degree[128] = {0};
    int adj[128][128] = {{0}};
    int *result;

    if (n <= 2) {
        *out_size = 0;
        return (int *)calloc(1, sizeof(int));
    }

    for (int i = 0; i < n - 1 && idx + 1 < size; i++) {
        int u = arr[idx++];
        int v = arr[idx++];
        adj[u][v] = 1;
        adj[v][u] = 1;
        degree[u]++;
        degree[v]++;
    }

    *out_size = n - 2;
    result = (int *)malloc((size_t)(n - 2) * sizeof(int));

    for (int step = 0; step < n - 2; step++) {
        int leaf = -1;
        int neighbor = -1;

        for (int i = 0; i < n; i++) {
            if (degree[i] == 1) {
                leaf = i;
                break;
            }
        }

        for (int j = 0; j < n; j++) {
            if (adj[leaf][j]) {
                neighbor = j;
                break;
            }
        }

        result[step] = neighbor;
        adj[leaf][neighbor] = 0;
        adj[neighbor][leaf] = 0;
        degree[leaf]--;
        degree[neighbor]--;
    }

    return result;
}
