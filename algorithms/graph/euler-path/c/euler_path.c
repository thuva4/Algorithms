#include "euler_path.h"
#include <stdlib.h>
#include <stdbool.h>

int euler_path(int* arr, int len) {
    int n = arr[0], m = arr[1];
    if (n == 0) return 1;
    int* degree = (int*)calloc(n, sizeof(int));
    int** adj = (int**)calloc(n, sizeof(int*));
    int* adj_sz = (int*)calloc(n, sizeof(int));
    int* adj_cap = (int*)calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) { adj_cap[i] = 4; adj[i] = (int*)malloc(4 * sizeof(int)); }
    for (int i = 0; i < m; i++) {
        int u = arr[2+2*i], v = arr[3+2*i];
        degree[u]++; degree[v]++;
        if (adj_sz[u] >= adj_cap[u]) { adj_cap[u] *= 2; adj[u] = (int*)realloc(adj[u], adj_cap[u]*sizeof(int)); }
        adj[u][adj_sz[u]++] = v;
        if (adj_sz[v] >= adj_cap[v]) { adj_cap[v] *= 2; adj[v] = (int*)realloc(adj[v], adj_cap[v]*sizeof(int)); }
        adj[v][adj_sz[v]++] = u;
    }
    for (int i = 0; i < n; i++) if (degree[i] % 2 != 0) { free(degree); for(int j=0;j<n;j++)free(adj[j]); free(adj);free(adj_sz);free(adj_cap); return 0; }
    int start = -1;
    for (int i = 0; i < n; i++) if (degree[i] > 0) { start = i; break; }
    if (start == -1) { free(degree); for(int j=0;j<n;j++)free(adj[j]); free(adj);free(adj_sz);free(adj_cap); return 1; }
    bool* visited = (bool*)calloc(n, sizeof(bool));
    int* stack = (int*)malloc(n * sizeof(int));
    int top = 0;
    stack[top++] = start;
    visited[start] = true;
    while (top > 0) {
        int v = stack[--top];
        for (int i = 0; i < adj_sz[v]; i++) {
            int u = adj[v][i];
            if (!visited[u]) { visited[u] = true; stack[top++] = u; }
        }
    }
    int result = 1;
    for (int i = 0; i < n; i++) if (degree[i] > 0 && !visited[i]) { result = 0; break; }
    free(degree); free(visited); free(stack);
    for(int i=0;i<n;i++)free(adj[i]); free(adj);free(adj_sz);free(adj_cap);
    return result;
}
