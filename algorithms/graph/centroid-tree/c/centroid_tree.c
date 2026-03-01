#include "centroid_tree.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#define MAX(a,b) (((a)>(b))?(a):(b))

typedef struct Node {
    int to;
    struct Node* next;
} Node;

typedef struct {
    Node** head;
    int n;
} Graph;

static Graph* create_graph(int n) {
    Graph* g = (Graph*)malloc(sizeof(Graph));
    g->n = n;
    g->head = (Node**)calloc(n, sizeof(Node*));
    return g;
}

static void add_edge(Graph* g, int u, int v) {
    Node* e1 = (Node*)malloc(sizeof(Node));
    e1->to = v;
    e1->next = g->head[u];
    g->head[u] = e1;

    Node* e2 = (Node*)malloc(sizeof(Node));
    e2->to = u;
    e2->next = g->head[v];
    g->head[v] = e2;
}

static void free_graph(Graph* g) {
    for (int i = 0; i < g->n; i++) {
        Node* curr = g->head[i];
        while (curr) {
            Node* temp = curr;
            curr = curr->next;
            free(temp);
        }
    }
    free(g->head);
    free(g);
}

static int* sz;
static bool* removed;
static int max_depth;

static void get_size(Graph* g, int u, int p) {
    sz[u] = 1;
    for (Node* e = g->head[u]; e; e = e->next) {
        int v = e->to;
        if (v != p && !removed[v]) {
            get_size(g, v, u);
            sz[u] += sz[v];
        }
    }
}

static int get_centroid(Graph* g, int u, int p, int total) {
    for (Node* e = g->head[u]; e; e = e->next) {
        int v = e->to;
        if (v != p && !removed[v] && sz[v] > total / 2) {
            return get_centroid(g, v, u, total);
        }
    }
    return u;
}

static void decompose(Graph* g, int u, int depth) {
    get_size(g, u, -1);
    int total = sz[u];
    int centroid = get_centroid(g, u, -1, total);
    
    if (depth > max_depth) max_depth = depth;
    
    removed[centroid] = true;
    
    for (Node* e = g->head[centroid]; e; e = e->next) {
        int v = e->to;
        if (!removed[v]) {
            decompose(g, v, depth + 1);
        }
    }
}

int centroid_tree(int arr[], int size) {
    if (size < 1) return 0;
    int n = arr[0];
    
    if (n == 0) return 0;
    if (n == 1) return 0;
    
    // Edges start at index 1.
    // Length check: 1 + 2*(N-1)
    if (size < 1 + 2 * (n - 1)) return 0;
    
    Graph* g = create_graph(n);
    for (int i = 0; i < n - 1; i++) {
        int u = arr[1 + 2 * i];
        int v = arr[1 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(g, u, v);
        }
    }
    
    sz = (int*)malloc(n * sizeof(int));
    removed = (bool*)calloc(n, sizeof(bool));
    max_depth = 0;
    
    decompose(g, 0, 0);
    
    free(sz);
    free(removed);
    free_graph(g);
    
    return max_depth;
}
