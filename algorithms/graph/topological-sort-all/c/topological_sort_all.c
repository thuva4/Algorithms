#include "topological_sort_all.h"
#include <string.h>

#define MAX_V 20
static int adj[MAX_V][MAX_V], adj_count[MAX_V];
static int in_deg[MAX_V], visited[MAX_V];
static int n_g, count_g;

static void backtrack(int placed) {
    if (placed == n_g) { count_g++; return; }
    for (int v = 0; v < n_g; v++) {
        if (!visited[v] && in_deg[v] == 0) {
            visited[v] = 1;
            for (int i = 0; i < adj_count[v]; i++) in_deg[adj[v][i]]--;
            backtrack(placed + 1);
            visited[v] = 0;
            for (int i = 0; i < adj_count[v]; i++) in_deg[adj[v][i]]++;
        }
    }
}

int topological_sort_all(int arr[], int size) {
    n_g = arr[0];
    int m = arr[1];
    memset(adj_count, 0, sizeof(int) * n_g);
    memset(in_deg, 0, sizeof(int) * n_g);
    memset(visited, 0, sizeof(int) * n_g);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i], v = arr[2 + 2 * i + 1];
        adj[u][adj_count[u]++] = v;
        in_deg[v]++;
    }
    count_g = 0;
    backtrack(0);
    return count_g;
}
