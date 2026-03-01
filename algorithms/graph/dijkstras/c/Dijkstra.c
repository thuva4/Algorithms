#include "dijkstra.h"
#include <stdlib.h>
#include <stdio.h>
#include <limits.h>

#define INF 1000000000

typedef struct Node {
    int to;
    int weight;
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

static void add_edge(Graph* g, int u, int v, int w) {
    Node* e = (Node*)malloc(sizeof(Node));
    e->to = v;
    e->weight = w;
    e->next = g->head[u];
    g->head[u] = e;
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

typedef struct {
    int u;
    int d;
} PQNode;

typedef struct {
    PQNode* nodes;
    int size;
    int capacity;
} MinHeap;

static MinHeap* create_heap(int capacity) {
    MinHeap* h = (MinHeap*)malloc(sizeof(MinHeap));
    h->nodes = (PQNode*)malloc(capacity * sizeof(PQNode));
    h->size = 0;
    h->capacity = capacity;
    return h;
}

static void push(MinHeap* h, int u, int d) {
    if (h->size == h->capacity) return;
    int i = h->size++;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (h->nodes[p].d <= d) break;
        h->nodes[i] = h->nodes[p];
        i = p;
    }
    h->nodes[i].u = u;
    h->nodes[i].d = d;
}

static PQNode pop(MinHeap* h) {
    PQNode ret = h->nodes[0];
    PQNode last = h->nodes[--h->size];
    int i = 0;
    while (i * 2 + 1 < h->size) {
        int child = i * 2 + 1;
        if (child + 1 < h->size && h->nodes[child + 1].d < h->nodes[child].d) {
            child++;
        }
        if (last.d <= h->nodes[child].d) break;
        h->nodes[i] = h->nodes[child];
        i = child;
    }
    h->nodes[i] = last;
    return ret;
}

static void free_heap(MinHeap* h) {
    free(h->nodes);
    free(h);
}

void dijkstra(int arr[], int size, int** result, int* result_size) {
    if (size < 2) {
        *result_size = 0;
        return;
    }
    
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 3 * m + 1) {
        *result_size = 0;
        return;
    }
    
    int start = arr[2 + 3 * m];
    if (start < 0 || start >= n) {
        *result_size = 0;
        return;
    }
    
    Graph* g = create_graph(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 3 * i];
        int v = arr[2 + 3 * i + 1];
        int w = arr[2 + 3 * i + 2];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(g, u, v, w);
        }
    }
    
    int* dist = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) dist[i] = INF;
    
    dist[start] = 0;
    MinHeap* pq = create_heap(m + n + 100);
    push(pq, start, 0);
    
    while (pq->size > 0) {
        PQNode current = pop(pq);
        int u = current.u;
        int d = current.d;
        
        if (d > dist[u]) continue;
        
        for (Node* e = g->head[u]; e; e = e->next) {
            int v = e->to;
            int weight = e->weight;
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                push(pq, v, dist[v]);
            }
        }
    }
    
    free_heap(pq);
    free_graph(g);
    
    *result = dist;
    *result_size = n;
}
