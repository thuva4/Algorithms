#include <stdio.h>
#include <stdlib.h>
#include "tree_diameter.h"

static void bfs(int start, int n, int** adj, int* adj_count, int* out_farthest, int* out_dist) {
    int* dist = (int*)malloc(n * sizeof(int));
    int* queue = (int*)malloc(n * sizeof(int));
    int i, front = 0, back = 0;
    for (i = 0; i < n; i++) dist[i] = -1;
    dist[start] = 0;
    queue[back++] = start;
    int farthest = start;
    while (front < back) {
        int node = queue[front++];
        for (i = 0; i < adj_count[node]; i++) {
            int nb = adj[node][i];
            if (dist[nb] == -1) {
                dist[nb] = dist[node] + 1;
                queue[back++] = nb;
                if (dist[nb] > dist[farthest]) farthest = nb;
            }
        }
    }
    *out_farthest = farthest;
    *out_dist = dist[farthest];
    free(dist);
    free(queue);
}

int tree_diameter(int* arr, int size) {
    int idx = 0;
    int n = arr[idx++];
    if (n <= 1) return 0;

    int m = (size - 1) / 2;
    int** adj = (int**)malloc(n * sizeof(int*));
    int* adj_count = (int*)calloc(n, sizeof(int));
    int* adj_cap = (int*)malloc(n * sizeof(int));
    int i;
    for (i = 0; i < n; i++) { adj[i] = (int*)malloc(4 * sizeof(int)); adj_cap[i] = 4; }

    for (i = 0; i < m; i++) {
        int u = arr[idx++], v = arr[idx++];
        if (adj_count[u] >= adj_cap[u]) { adj_cap[u] *= 2; adj[u] = (int*)realloc(adj[u], adj_cap[u] * sizeof(int)); }
        adj[u][adj_count[u]++] = v;
        if (adj_count[v] >= adj_cap[v]) { adj_cap[v] *= 2; adj[v] = (int*)realloc(adj[v], adj_cap[v] * sizeof(int)); }
        adj[v][adj_count[v]++] = u;
    }

    int farthest, diameter;
    bfs(0, n, adj, adj_count, &farthest, &diameter);
    bfs(farthest, n, adj, adj_count, &farthest, &diameter);

    for (i = 0; i < n; i++) free(adj[i]);
    free(adj); free(adj_count); free(adj_cap);
    return diameter;
}

int main() {
    int a1[] = {4, 0, 1, 1, 2, 2, 3};
    printf("%d\n", tree_diameter(a1, 7)); /* 3 */

    int a2[] = {5, 0, 1, 0, 2, 0, 3, 0, 4};
    printf("%d\n", tree_diameter(a2, 9)); /* 2 */

    int a3[] = {2, 0, 1};
    printf("%d\n", tree_diameter(a3, 3)); /* 1 */

    int a4[] = {1};
    printf("%d\n", tree_diameter(a4, 1)); /* 0 */

    return 0;
}
