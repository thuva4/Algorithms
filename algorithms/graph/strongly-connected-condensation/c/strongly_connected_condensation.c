#include "strongly_connected_condensation.h"
#include <string.h>

#define MAX_V 1000
#define MAX_E 10000

static int adj[MAX_V][MAX_V];
static int adj_count[MAX_V];
static int disc[MAX_V], low_val[MAX_V], stack_arr[MAX_V];
static int on_stack[MAX_V];
static int index_counter, scc_count, stack_top;

static void strongconnect(int v) {
    disc[v] = index_counter;
    low_val[v] = index_counter;
    index_counter++;
    stack_arr[stack_top++] = v;
    on_stack[v] = 1;

    for (int i = 0; i < adj_count[v]; i++) {
        int w = adj[v][i];
        if (disc[w] == -1) {
            strongconnect(w);
            if (low_val[w] < low_val[v]) low_val[v] = low_val[w];
        } else if (on_stack[w]) {
            if (disc[w] < low_val[v]) low_val[v] = disc[w];
        }
    }

    if (low_val[v] == disc[v]) {
        scc_count++;
        while (1) {
            int w = stack_arr[--stack_top];
            on_stack[w] = 0;
            if (w == v) break;
        }
    }
}

int strongly_connected_condensation(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];

    memset(adj_count, 0, sizeof(int) * n);
    memset(on_stack, 0, sizeof(int) * n);
    memset(disc, -1, sizeof(int) * n);

    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        adj[u][adj_count[u]++] = v;
    }

    index_counter = 0;
    scc_count = 0;
    stack_top = 0;

    for (int v = 0; v < n; v++) {
        if (disc[v] == -1) strongconnect(v);
    }

    return scc_count;
}
