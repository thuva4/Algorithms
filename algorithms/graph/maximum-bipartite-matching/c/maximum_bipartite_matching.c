#include "maximum_bipartite_matching.h"
#include <string.h>

#define MAX_V 500
static int adj[MAX_V][MAX_V], adj_count[MAX_V];
static int match_right[MAX_V], visited[MAX_V];

static int dfs(int u) {
    for (int i = 0; i < adj_count[u]; i++) {
        int v = adj[u][i];
        if (!visited[v]) {
            visited[v] = 1;
            if (match_right[v] == -1 || dfs(match_right[v])) {
                match_right[v] = u;
                return 1;
            }
        }
    }
    return 0;
}

int maximum_bipartite_matching(int arr[], int size) {
    int nLeft = arr[0], nRight = arr[1], m = arr[2];
    memset(adj_count, 0, sizeof(int) * nLeft);
    memset(match_right, -1, sizeof(int) * nRight);
    for (int i = 0; i < m; i++) {
        int u = arr[3 + 2 * i], v = arr[3 + 2 * i + 1];
        adj[u][adj_count[u]++] = v;
    }
    int result = 0;
    for (int u = 0; u < nLeft; u++) {
        memset(visited, 0, sizeof(int) * nRight);
        if (dfs(u)) result++;
    }
    return result;
}
