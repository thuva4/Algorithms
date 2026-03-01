#include "network_flow_mincost.h"
#include <string.h>
#include <limits.h>

#define MAX_V 200
#define MAX_EDGES 2000

static int head_arr[MAX_V], to_arr[MAX_EDGES], cap_arr[MAX_EDGES];
static int cost_arr[MAX_EDGES], nxt_arr[MAX_EDGES];
static int edge_cnt;

static void add_edge(int u, int v, int c, int w) {
    to_arr[edge_cnt] = v; cap_arr[edge_cnt] = c; cost_arr[edge_cnt] = w;
    nxt_arr[edge_cnt] = head_arr[u]; head_arr[u] = edge_cnt++;
    to_arr[edge_cnt] = u; cap_arr[edge_cnt] = 0; cost_arr[edge_cnt] = -w;
    nxt_arr[edge_cnt] = head_arr[v]; head_arr[v] = edge_cnt++;
}

int network_flow_mincost(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];
    int src = arr[2];
    int sink = arr[3];
    edge_cnt = 0;
    memset(head_arr, -1, sizeof(int) * n);

    for (int i = 0; i < m; i++) {
        int u = arr[4 + 4 * i];
        int v = arr[4 + 4 * i + 1];
        int c = arr[4 + 4 * i + 2];
        int w = arr[4 + 4 * i + 3];
        add_edge(u, v, c, w);
    }

    int INF = INT_MAX / 2;
    int total_cost = 0;

    while (1) {
        int dist[MAX_V], in_queue[MAX_V], prev_edge[MAX_V], prev_node[MAX_V];
        for (int i = 0; i < n; i++) { dist[i] = INF; in_queue[i] = 0; prev_edge[i] = -1; }
        dist[src] = 0;
        int queue[MAX_V * 10];
        int qf = 0, qb = 0;
        queue[qb++] = src;
        in_queue[src] = 1;

        while (qf < qb) {
            int u = queue[qf++];
            in_queue[u] = 0;
            for (int e = head_arr[u]; e != -1; e = nxt_arr[e]) {
                int v = to_arr[e];
                if (cap_arr[e] > 0 && dist[u] + cost_arr[e] < dist[v]) {
                    dist[v] = dist[u] + cost_arr[e];
                    prev_edge[v] = e;
                    prev_node[v] = u;
                    if (!in_queue[v]) {
                        queue[qb++] = v;
                        in_queue[v] = 1;
                    }
                }
            }
        }

        if (dist[sink] == INF) break;

        int bottleneck = INF;
        for (int v = sink; v != src; v = prev_node[v]) {
            if (cap_arr[prev_edge[v]] < bottleneck)
                bottleneck = cap_arr[prev_edge[v]];
        }

        for (int v = sink; v != src; v = prev_node[v]) {
            int e = prev_edge[v];
            cap_arr[e] -= bottleneck;
            cap_arr[e ^ 1] += bottleneck;
        }

        total_cost += bottleneck * dist[sink];
    }

    return total_cost;
}
