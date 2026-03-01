#include "topological_sort_kahn.h"
#include <stdlib.h>

int *topological_sort_kahn(int arr[], int size, int *out_size) {
    *out_size = 0;
    if (size < 2) {
        return NULL;
    }

    int num_vertices = arr[0];
    int num_edges = arr[1];

    int *in_degree = (int *)calloc(num_vertices, sizeof(int));
    int **adj = (int **)calloc(num_vertices, sizeof(int *));
    int *adj_count = (int *)calloc(num_vertices, sizeof(int));
    int *adj_cap = (int *)calloc(num_vertices, sizeof(int));

    for (int i = 0; i < num_vertices; i++) {
        adj_cap[i] = 4;
        adj[i] = (int *)malloc(adj_cap[i] * sizeof(int));
    }

    for (int i = 0; i < num_edges; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (adj_count[u] >= adj_cap[u]) {
            adj_cap[u] *= 2;
            adj[u] = (int *)realloc(adj[u], adj_cap[u] * sizeof(int));
        }
        adj[u][adj_count[u]++] = v;
        in_degree[v]++;
    }

    int *queue = (int *)malloc(num_vertices * sizeof(int));
    int front = 0, back = 0;

    for (int v = 0; v < num_vertices; v++) {
        if (in_degree[v] == 0) {
            queue[back++] = v;
        }
    }

    int *result = (int *)malloc(num_vertices * sizeof(int));
    int count = 0;

    while (front < back) {
        int u = queue[front++];
        result[count++] = u;
        for (int i = 0; i < adj_count[u]; i++) {
            int v = adj[u][i];
            in_degree[v]--;
            if (in_degree[v] == 0) {
                queue[back++] = v;
            }
        }
    }

    for (int i = 0; i < num_vertices; i++) {
        free(adj[i]);
    }
    free(adj);
    free(adj_count);
    free(adj_cap);
    free(in_degree);
    free(queue);

    if (count == num_vertices) {
        *out_size = count;
        return result;
    }

    free(result);
    *out_size = 0;
    return NULL;
}
