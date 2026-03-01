#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "shortest_path_dag.h"

#define MAXN 10001

/**
 * Find shortest path from source to vertex n-1 in a DAG.
 *
 * Input format: [n, m, src, u1, v1, w1, ...]
 * Returns: shortest distance from src to n-1, or -1 if unreachable
 */
int shortest_path_dag(int* arr, int size) {
    int idx = 0;
    int n = arr[idx++];
    int m = arr[idx++];
    int src = arr[idx++];

    int* adj_to = (int*)malloc(m * sizeof(int));
    int* adj_w = (int*)malloc(m * sizeof(int));
    int* head = (int*)malloc(n * sizeof(int));
    int* nxt = (int*)malloc(m * sizeof(int));
    int* in_degree = (int*)calloc(n, sizeof(int));
    int edge_cnt = 0;
    int i;

    for (i = 0; i < n; i++) head[i] = -1;

    for (i = 0; i < m; i++) {
        int u = arr[idx++], v = arr[idx++], w = arr[idx++];
        adj_to[edge_cnt] = v;
        adj_w[edge_cnt] = w;
        nxt[edge_cnt] = head[u];
        head[u] = edge_cnt++;
        in_degree[v]++;
    }

    /* Kahn's topological sort */
    int* queue = (int*)malloc(n * sizeof(int));
    int front = 0, back = 0;
    for (i = 0; i < n; i++)
        if (in_degree[i] == 0) queue[back++] = i;

    int* topo = (int*)malloc(n * sizeof(int));
    int topo_cnt = 0;
    while (front < back) {
        int node = queue[front++];
        topo[topo_cnt++] = node;
        int e;
        for (e = head[node]; e != -1; e = nxt[e]) {
            if (--in_degree[adj_to[e]] == 0) queue[back++] = adj_to[e];
        }
    }

    int* dist = (int*)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) dist[i] = INT_MAX;
    dist[src] = 0;

    for (i = 0; i < topo_cnt; i++) {
        int u = topo[i];
        if (dist[u] == INT_MAX) continue;
        int e;
        for (e = head[u]; e != -1; e = nxt[e]) {
            if (dist[u] + adj_w[e] < dist[adj_to[e]]) {
                dist[adj_to[e]] = dist[u] + adj_w[e];
            }
        }
    }

    int result = dist[n - 1] == INT_MAX ? -1 : dist[n - 1];

    free(adj_to); free(adj_w); free(head); free(nxt);
    free(in_degree); free(queue); free(topo); free(dist);
    return result;
}

int main() {
    int a1[] = {4, 4, 0, 0, 1, 2, 0, 2, 4, 1, 2, 1, 1, 3, 7};
    printf("%d\n", shortest_path_dag(a1, 15)); /* 3 */

    int a2[] = {3, 3, 0, 0, 1, 5, 0, 2, 3, 1, 2, 1};
    printf("%d\n", shortest_path_dag(a2, 12)); /* 3 */

    int a3[] = {2, 1, 0, 0, 1, 10};
    printf("%d\n", shortest_path_dag(a3, 6)); /* 10 */

    int a4[] = {3, 1, 0, 1, 2, 5};
    printf("%d\n", shortest_path_dag(a4, 6)); /* -1 */

    return 0;
}
