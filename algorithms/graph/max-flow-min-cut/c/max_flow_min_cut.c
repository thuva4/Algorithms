#include "max_flow_min_cut.h"
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>
#include <string.h>

int max_flow_min_cut(int* arr, int len) {
    int n = arr[0], m = arr[1], src = arr[2], sink = arr[3];
    int* cap = (int*)calloc(n * n, sizeof(int));
    for (int i = 0; i < m; i++) cap[arr[4+3*i]*n + arr[5+3*i]] += arr[6+3*i];
    int maxFlow = 0;
    int* parent = (int*)malloc(n * sizeof(int));
    int* queue = (int*)malloc(n * sizeof(int));
    while (1) {
        memset(parent, -1, n * sizeof(int));
        parent[src] = src;
        int front = 0, back = 0;
        queue[back++] = src;
        while (front < back && parent[sink] == -1) {
            int u = queue[front++];
            for (int v = 0; v < n; v++)
                if (parent[v] == -1 && cap[u*n+v] > 0) { parent[v] = u; queue[back++] = v; }
        }
        if (parent[sink] == -1) break;
        int flow = INT_MAX;
        for (int v = sink; v != src; v = parent[v]) {
            int c = cap[parent[v]*n+v];
            if (c < flow) flow = c;
        }
        for (int v = sink; v != src; v = parent[v]) {
            cap[parent[v]*n+v] -= flow;
            cap[v*n+parent[v]] += flow;
        }
        maxFlow += flow;
    }
    free(cap); free(parent); free(queue);
    return maxFlow;
}
