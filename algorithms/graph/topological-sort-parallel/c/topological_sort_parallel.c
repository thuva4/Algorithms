#include "topological_sort_parallel.h"
#include <stdlib.h>
#include <string.h>

int topological_sort_parallel(const int data[], int data_len) {
    int n = data[0];
    int m = data[1];

    int *indegree = (int *)calloc(n, sizeof(int));
    int *adj_start = (int *)calloc(n + 1, sizeof(int));
    int *adj_count = (int *)calloc(n, sizeof(int));
    int *edges = (int *)malloc(m * sizeof(int));
    int *queue = (int *)malloc(n * sizeof(int));

    int idx = 2;
    int i, e;

    /* Count outgoing edges */
    for (e = 0; e < m; e++) {
        int u = data[idx + 2 * e];
        adj_count[u]++;
    }

    /* Build adjacency list offsets */
    adj_start[0] = 0;
    for (i = 0; i < n; i++) {
        adj_start[i + 1] = adj_start[i] + adj_count[i];
    }

    int *pos = (int *)calloc(n, sizeof(int));
    for (e = 0; e < m; e++) {
        int u = data[idx + 2 * e];
        int v = data[idx + 2 * e + 1];
        edges[adj_start[u] + pos[u]] = v;
        pos[u]++;
        indegree[v]++;
    }

    int head = 0, tail = 0;
    for (i = 0; i < n; i++) {
        if (indegree[i] == 0) queue[tail++] = i;
    }

    int rounds = 0;
    int processed = 0;

    while (head < tail) {
        int size = tail - head;
        for (i = 0; i < size; i++) {
            int node = queue[head++];
            processed++;
            int j;
            for (j = adj_start[node]; j < adj_start[node] + adj_count[node]; j++) {
                int neighbor = edges[j];
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    queue[tail++] = neighbor;
                }
            }
        }
        rounds++;
    }

    free(indegree);
    free(adj_start);
    free(adj_count);
    free(edges);
    free(queue);
    free(pos);

    return processed == n ? rounds : -1;
}
