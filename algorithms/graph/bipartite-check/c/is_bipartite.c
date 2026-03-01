#include "is_bipartite.h"
#include <string.h>

#define MAX_V 1000

static int adj_list[MAX_V][MAX_V], adj_cnt[MAX_V];
static int color_arr[MAX_V];
static int queue_arr[MAX_V];

int is_bipartite(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];

    memset(adj_cnt, 0, sizeof(int) * n);
    memset(color_arr, -1, sizeof(int) * n);

    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj_list[u][adj_cnt[u]++] = v;
        adj_list[v][adj_cnt[v]++] = u;
    }

    for (int start = 0; start < n; start++) {
        if (color_arr[start] != -1) continue;
        color_arr[start] = 0;
        int front = 0, back = 0;
        queue_arr[back++] = start;
        while (front < back) {
            int u = queue_arr[front++];
            for (int i = 0; i < adj_cnt[u]; i++) {
                int v = adj_list[u][i];
                if (color_arr[v] == -1) {
                    color_arr[v] = 1 - color_arr[u];
                    queue_arr[back++] = v;
                } else if (color_arr[v] == color_arr[u]) {
                    return 0;
                }
            }
        }
    }

    return 1;
}
