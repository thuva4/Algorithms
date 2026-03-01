#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include "dp_on_trees.h"

#define MAXN 100005

static int adj[MAXN][10];
static int adj_cnt[MAXN];
static int dp_val[MAXN];
static int par[MAXN];
static int visited[MAXN];
static int order[MAXN];

static int dp_on_trees_impl(int n, int* values, int edges[][2], int num_edges) {
    if (n == 0) return 0;
    if (n == 1) return values[0];

    for (int i = 0; i < n; i++) {
        adj_cnt[i] = 0;
        visited[i] = 0;
        par[i] = -1;
    }

    for (int i = 0; i < num_edges; i++) {
        int u = edges[i][0], v = edges[i][1];
        adj[u][adj_cnt[u]++] = v;
        adj[v][adj_cnt[v]++] = u;
    }

    /* BFS */
    int front = 0, back = 0;
    order[back++] = 0;
    visited[0] = 1;
    while (front < back) {
        int node = order[front++];
        for (int i = 0; i < adj_cnt[node]; i++) {
            int child = adj[node][i];
            if (!visited[child]) {
                visited[child] = 1;
                par[child] = node;
                order[back++] = child;
            }
        }
    }

    /* Process in reverse BFS order */
    for (int i = back - 1; i >= 0; i--) {
        int node = order[i];
        int best_child = 0;
        for (int j = 0; j < adj_cnt[node]; j++) {
            int child = adj[node][j];
            if (child != par[node]) {
                if (dp_val[child] > best_child) best_child = dp_val[child];
            }
        }
        dp_val[node] = values[node] + best_child;
    }

    int ans = INT_MIN;
    for (int i = 0; i < n; i++) {
        if (dp_val[i] > ans) ans = dp_val[i];
    }
    return ans;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int values[MAXN];
    for (int i = 0; i < n; i++) scanf("%d", &values[i]);
    int edges[MAXN][2];
    for (int i = 0; i < n - 1; i++) {
        scanf("%d %d", &edges[i][0], &edges[i][1]);
    }
    printf("%d\n", dp_on_trees_impl(n, values, edges, n - 1));
    return 0;
}

int dp_on_trees(int arr[], int size) {
    if (size < 1) {
        return 0;
    }

    int n = arr[0];
    if (n <= 0 || size < 1 + n) {
        return 0;
    }

    int values[MAXN];
    int edges[MAXN][2];

    for (int i = 0; i < n; i++) {
        values[i] = arr[1 + i];
    }

    int remaining = size - 1 - n;
    int num_edges = remaining / 2;
    for (int i = 0; i < num_edges; i++) {
        edges[i][0] = arr[1 + n + (2 * i)];
        edges[i][1] = arr[1 + n + (2 * i) + 1];
    }

    return dp_on_trees_impl(n, values, edges, num_edges);
}
