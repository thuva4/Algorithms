#include "two_sat.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#define MAX(a,b) (((a)>(b))?(a):(b))
#define MIN(a,b) (((a)<(b))?(a):(b))

typedef struct Edge {
    int to;
    struct Edge* next;
} Edge;

typedef struct {
    Edge** head;
    int n; // 2 * num_vars
} Graph;

static Graph* create_graph(int n) {
    Graph* g = (Graph*)malloc(sizeof(Graph));
    g->n = n;
    g->head = (Edge**)calloc(n, sizeof(Edge*));
    return g;
}

static void add_edge(Graph* g, int u, int v) {
    Edge* e = (Edge*)malloc(sizeof(Edge));
    e->to = v;
    e->next = g->head[u];
    g->head[u] = e;
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

// Global variables for Tarjan's
static int timer;
static int* dfn;
static int* low;
static int* stack;
static int top;
static bool* in_stack;
static int scc_cnt;
static int* scc_id;

static void tarjan(Graph* g, int u) {
    dfn[u] = low[u] = ++timer;
    stack[++top] = u;
    in_stack[u] = true;

    for (Edge* e = g->head[u]; e; e = e->next) {
        int v = e->to;
        if (!dfn[v]) {
            tarjan(g, v);
            low[u] = MIN(low[u], low[v]);
        } else if (in_stack[v]) {
            low[u] = MIN(low[u], dfn[v]);
        }
    }

    if (low[u] == dfn[u]) {
        scc_cnt++;
        int v;
        do {
            v = stack[top--];
            in_stack[v] = false;
            scc_id[v] = scc_cnt;
        } while (u != v);
    }
}

int two_sat(int arr[], int size) {
    if (size < 2) return 0; // Should have at least N and M
    int n = arr[0];
    int m = arr[1];
    
    // Check if array size matches expected length
    if (size < 2 + 2 * m) return 0; // Or error

    // Graph nodes: 2*n. 
    // Variables 1..n. 
    // Let x be i. Not x is i + n? Or just map 1..n to 0..n-1?
    // Map:
    // Var i (1-based) -> Node 2*(i-1)
    // Not Var i -> Node 2*(i-1) + 1
    // Negation of node u: u^1
    
    Graph* g = create_graph(2 * n);

    for (int i = 0; i < m; i++) {
        int u_raw = arr[2 + 2 * i];
        int v_raw = arr[2 + 2 * i + 1];

        int u = (abs(u_raw) - 1) * 2 + (u_raw < 0 ? 1 : 0);
        int v = (abs(v_raw) - 1) * 2 + (v_raw < 0 ? 1 : 0);
        
        // Clause (u or v) => (!u -> v) and (!v -> u)
        int not_u = u ^ 1;
        int not_v = v ^ 1;
        
        add_edge(g, not_u, v);
        add_edge(g, not_v, u);
    }

    // Tarjan's
    timer = 0;
    scc_cnt = 0;
    top = -1;
    
    int num_nodes = 2 * n;
    dfn = (int*)calloc(num_nodes, sizeof(int));
    low = (int*)calloc(num_nodes, sizeof(int));
    stack = (int*)malloc(num_nodes * sizeof(int));
    in_stack = (bool*)calloc(num_nodes, sizeof(bool));
    scc_id = (int*)calloc(num_nodes, sizeof(int));

    for (int i = 0; i < num_nodes; i++) {
        if (!dfn[i]) tarjan(g, i);
    }

    int satisfiable = 1;
    for (int i = 0; i < n; i++) {
        if (scc_id[2 * i] == scc_id[2 * i + 1]) {
            satisfiable = 0;
            break;
        }
    }

    free(dfn);
    free(low);
    free(stack);
    free(in_stack);
    free(scc_id);
    free_graph(g);

    return satisfiable;
}
