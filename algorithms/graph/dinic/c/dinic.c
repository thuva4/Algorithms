#include "dinic.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

#define MIN(a,b) (((a)<(b))?(a):(b))
#define INF INT_MAX

typedef struct Edge {
    int to;
    int rev; // index of reverse edge in adj[to]
    long long cap;
    long long flow;
} Edge;

typedef struct {
    Edge* edges;
    int size;
    int capacity;
} EdgeList;

static void add_edge_to_list(EdgeList* list, int to, int rev, long long cap) {
    if (list->size == list->capacity) {
        list->capacity = list->capacity == 0 ? 2 : list->capacity * 2;
        list->edges = (Edge*)realloc(list->edges, list->capacity * sizeof(Edge));
    }
    list->edges[list->size++] = (Edge){to, rev, cap, 0};
}

static EdgeList* adj;
static int* level;
static int* ptr;
static int n_nodes;

static void add_edge(int u, int v, long long cap) {
    add_edge_to_list(&adj[u], v, adj[v].size, cap);
    add_edge_to_list(&adj[v], u, adj[u].size - 1, 0);
}

static bool bfs(int s, int t) {
    for (int i = 0; i < n_nodes; i++) level[i] = -1;
    level[s] = 0;
    
    int* q = (int*)malloc(n_nodes * sizeof(int));
    int front = 0, rear = 0;
    q[rear++] = s;
    
    while (front < rear) {
        int u = q[front++];
        for (int i = 0; i < adj[u].size; i++) {
            Edge e = adj[u].edges[i];
            if (e.cap - e.flow > 0 && level[e.to] == -1) {
                level[e.to] = level[u] + 1;
                q[rear++] = e.to;
            }
        }
    }
    
    bool reached = level[t] != -1;
    free(q);
    return reached;
}

static long long dfs(int u, int t, long long pushed) {
    if (pushed == 0) return 0;
    if (u == t) return pushed;
    
    for (int* cid = &ptr[u]; *cid < adj[u].size; (*cid)++) {
        int id = *cid;
        int v = adj[u].edges[id].to;
        int rev = adj[u].edges[id].rev;
        long long cap = adj[u].edges[id].cap;
        long long flow = adj[u].edges[id].flow;
        
        if (level[u] + 1 != level[v] || cap - flow == 0) continue;
        
        long long tr = pushed;
        if (cap - flow < tr) tr = cap - flow;
        
        long long pushed_flow = dfs(v, t, tr);
        if (pushed_flow == 0) continue;
        
        adj[u].edges[id].flow += pushed_flow;
        adj[v].edges[rev].flow -= pushed_flow;
        
        return pushed_flow;
    }
    
    return 0;
}

int dinic(int arr[], int size) {
    if (size < 4) return 0;
    int n = arr[0];
    int m = arr[1];
    int s = arr[2];
    int t = arr[3];
    
    if (size < 4 + 3 * m) return 0;
    
    n_nodes = n;
    adj = (EdgeList*)calloc(n, sizeof(EdgeList));
    for (int i = 0; i < n; i++) {
        adj[i].size = 0;
        adj[i].capacity = 0;
        adj[i].edges = NULL;
    }
    
    for (int i = 0; i < m; i++) {
        int u = arr[4 + 3 * i];
        int v = arr[4 + 3 * i + 1];
        long long cap = arr[4 + 3 * i + 2];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(u, v, cap);
        }
    }
    
    level = (int*)malloc(n * sizeof(int));
    ptr = (int*)malloc(n * sizeof(int));
    
    long long flow = 0;
    while (bfs(s, t)) {
        for (int i = 0; i < n; i++) ptr[i] = 0;
        while (true) {
            long long pushed = dfs(s, t, INF); // Using INT_MAX as simpler infinity for int cap
            if (pushed == 0) break;
            flow += pushed;
        }
    }
    
    for (int i = 0; i < n; i++) free(adj[i].edges);
    free(adj);
    free(level);
    free(ptr);
    
    return (int)flow;
}
