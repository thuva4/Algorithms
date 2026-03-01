#include "count_bridges.h"
#include <string.h>

#define MAX_V 1000

static int adj_list[MAX_V][MAX_V], adj_cnt[MAX_V];
static int disc_arr[MAX_V], low_arr[MAX_V], par_arr[MAX_V];
static int timer_val, bridge_cnt;

static void dfs(int u) {
    disc_arr[u] = timer_val;
    low_arr[u] = timer_val;
    timer_val++;

    for (int i = 0; i < adj_cnt[u]; i++) {
        int v = adj_list[u][i];
        if (disc_arr[v] == -1) {
            par_arr[v] = u;
            dfs(v);
            if (low_arr[v] < low_arr[u]) low_arr[u] = low_arr[v];
            if (low_arr[v] > disc_arr[u]) bridge_cnt++;
        } else if (v != par_arr[u]) {
            if (disc_arr[v] < low_arr[u]) low_arr[u] = disc_arr[v];
        }
    }
}

int count_bridges(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];

    memset(adj_cnt, 0, sizeof(int) * n);
    memset(disc_arr, -1, sizeof(int) * n);
    memset(par_arr, -1, sizeof(int) * n);
    timer_val = 0;
    bridge_cnt = 0;

    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj_list[u][adj_cnt[u]++] = v;
        adj_list[v][adj_cnt[v]++] = u;
    }

    for (int i = 0; i < n; i++) {
        if (disc_arr[i] == -1) dfs(i);
    }

    return bridge_cnt;
}
