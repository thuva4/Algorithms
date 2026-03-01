#include "spfa.h"
#include <string.h>
#include <limits.h>

#define MAX_V 1000
#define MAX_E 10000

static int adj_to[MAX_E], adj_w[MAX_E], adj_next[MAX_E], head[MAX_V];
static int edge_count;

static void add_edge(int u, int v, int w) {
    adj_to[edge_count] = v;
    adj_w[edge_count] = w;
    adj_next[edge_count] = head[u];
    head[u] = edge_count++;
}

int spfa(int arr[], int size) {
    int n = arr[0];
    int m = arr[1];
    int src = arr[2];
    edge_count = 0;
    memset(head, -1, sizeof(int) * n);

    for (int i = 0; i < m; i++) {
        int u = arr[3 + 3 * i];
        int v = arr[3 + 3 * i + 1];
        int w = arr[3 + 3 * i + 2];
        add_edge(u, v, w);
    }

    int INF = INT_MAX / 2;
    int dist[MAX_V];
    int in_queue[MAX_V];
    int queue[MAX_V * 10];
    int qfront = 0, qback = 0;

    for (int i = 0; i < n; i++) { dist[i] = INF; in_queue[i] = 0; }
    dist[src] = 0;
    queue[qback++] = src;
    in_queue[src] = 1;

    while (qfront < qback) {
        int u = queue[qfront++];
        in_queue[u] = 0;
        for (int e = head[u]; e != -1; e = adj_next[e]) {
            int v = adj_to[e], w = adj_w[e];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                if (!in_queue[v]) {
                    queue[qback++] = v;
                    in_queue[v] = 1;
                }
            }
        }
    }

    return dist[n - 1] == INF ? -1 : dist[n - 1];
}
