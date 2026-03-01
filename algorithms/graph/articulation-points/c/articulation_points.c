#include "articulation_points.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#define MIN(a,b) (((a)<(b))?(a):(b))

typedef struct Edge {
    int to;
    struct Edge* next;
} Edge;

typedef struct {
    Edge** head;
    int n;
} Graph;

static Graph* create_graph(int n) {
    Graph* g = (Graph*)malloc(sizeof(Graph));
    g->n = n;
    g->head = (Edge**)calloc(n, sizeof(Edge*));
    return g;
}

static void add_edge(Graph* g, int u, int v) {
    Edge* e1 = (Edge*)malloc(sizeof(Edge));
    e1->to = v;
    e1->next = g->head[u];
    g->head[u] = e1;

    Edge* e2 = (Edge*)malloc(sizeof(Edge));
    e2->to = u;
    e2->next = g->head[v];
    g->head[v] = e2;
}

static void free_graph(Graph* g) {
    for (int i = 0; i < g->n; i++) {
        Edge* curr = g->head[i];
        while (curr) {
            Edge* temp = curr;
            curr = curr->next;
            free(temp);
        }
    }
    free(g->head);
    free(g);
}

static int timer;
static int* dfn;
static int* low;
static bool* is_ap;

static void dfs(Graph* g, int u, int p) {
    dfn[u] = low[u] = ++timer;
    int children = 0;

    for (Edge* e = g->head[u]; e; e = e->next) {
        int v = e->to;
        if (v == p) continue;

        if (dfn[v]) {
            low[u] = MIN(low[u], dfn[v]);
        } else {
            children++;
            dfs(g, v, u);
            low[u] = MIN(low[u], low[v]);
            if (p != -1 && low[v] >= dfn[u]) {
                is_ap[u] = true;
            }
        }
    }

    if (p == -1 && children > 1) {
        is_ap[u] = true;
    }
}

int articulation_points(int arr[], int size) {
    if (size < 2) return 0;
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 2 * m) return 0;

    Graph* g = create_graph(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(g, u, v);
        }
    }

    timer = 0;
    dfn = (int*)calloc(n, sizeof(int));
    low = (int*)calloc(n, sizeof(int));
    is_ap = (bool*)calloc(n, sizeof(bool));

    for (int i = 0; i < n; i++) {
        if (!dfn[i]) dfs(g, i, -1);
    }

    int count = 0;
    for (int i = 0; i < n; i++) {
        if (is_ap[i]) count++;
    }

    free(dfn);
    free(low);
    free(is_ap);
    free_graph(g);

    return count;
}
