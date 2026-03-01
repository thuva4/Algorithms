#include "chromatic_number.h"
#include <string.h>

#define MAX_V 100

static int adj_list[MAX_V][MAX_V], adj_cnt[MAX_V];
static int colors_arr[MAX_V];
static int num_v;

static int is_safe(int v, int c) {
    for (int i = 0; i < adj_cnt[v]; i++) {
        if (colors_arr[adj_list[v][i]] == c) return 0;
    }
    return 1;
}

static int solve(int v, int k) {
    if (v == num_v) return 1;
    for (int c = 1; c <= k; c++) {
        if (is_safe(v, c)) {
            colors_arr[v] = c;
            if (solve(v + 1, k)) return 1;
            colors_arr[v] = 0;
        }
    }
    return 0;
}

int chromatic_number(int arr[], int size) {
    num_v = arr[0];
    int m = arr[1];
    if (num_v == 0) return 0;
    if (m == 0) return 1;

    memset(adj_cnt, 0, sizeof(int) * num_v);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj_list[u][adj_cnt[u]++] = v;
        adj_list[v][adj_cnt[v]++] = u;
    }

    for (int k = 1; k <= num_v; k++) {
        memset(colors_arr, 0, sizeof(int) * num_v);
        if (solve(0, k)) return k;
    }
    return num_v;
}
