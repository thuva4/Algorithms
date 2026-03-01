#include "a_star_search.h"
#include <stdlib.h>
#include <limits.h>

#define MAX_SIZE 10000

typedef struct {
    int id;
    int f, g;
} Node;

typedef struct {
    Node* nodes;
    int size;
    int capacity;
} MinHeap;

static MinHeap* createHeap(int capacity) {
    MinHeap* h = (MinHeap*)malloc(sizeof(MinHeap));
    h->nodes = (Node*)malloc(capacity * sizeof(Node));
    h->size = 0;
    h->capacity = capacity;
    return h;
}

static void push(MinHeap* h, Node n) {
    if (h->size == h->capacity) return;
    int i = h->size++;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (h->nodes[p].f <= n.f) break;
        h->nodes[i] = h->nodes[p];
        i = p;
    }
    h->nodes[i] = n;
}

static Node pop(MinHeap* h) {
    Node ret = h->nodes[0];
    Node last = h->nodes[--h->size];
    int i = 0;
    while (i * 2 + 1 < h->size) {
        int child = i * 2 + 1;
        if (child + 1 < h->size && h->nodes[child + 1].f < h->nodes[child].f) {
            child++;
        }
        if (last.f <= h->nodes[child].f) break;
        h->nodes[i] = h->nodes[child];
        i = child;
    }
    h->nodes[i] = last;
    return ret;
}

typedef struct Edge {
    int to;
    int weight;
    struct Edge* next;
} Edge;

int a_star_search(int arr[], int size) {
    if (size < 2) return -1;
    
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 3 * m + 2 + n) return -1;
    
    int start = arr[2 + 3 * m];
    int goal = arr[2 + 3 * m + 1];
    
    if (start < 0 || start >= n || goal < 0 || goal >= n) return -1;
    if (start == goal) return 0;
    
    int* h = &arr[2 + 3 * m + 2];
    
    Edge** adj = (Edge**)calloc(n, sizeof(Edge*));
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 3 * i];
        int v = arr[2 + 3 * i + 1];
        int w = arr[2 + 3 * i + 2];
        
        if (u >= 0 && u < n && v >= 0 && v < n) {
            Edge* e = (Edge*)malloc(sizeof(Edge));
            e->to = v;
            e->weight = w;
            e->next = adj[u];
            adj[u] = e;
        }
    }
    
    int* gScore = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) gScore[i] = INT_MAX;
    
    gScore[start] = 0;
    
    MinHeap* openSet = createHeap(m + n + 100);
    Node startNode = {start, h[start], 0};
    push(openSet, startNode);
    
    int cost = -1;
    
    while (openSet->size > 0) {
        Node current = pop(openSet);
        int u = current.id;
        
        if (u == goal) {
            cost = current.g;
            break;
        }
        
        if (current.g > gScore[u]) continue;
        
        for (Edge* e = adj[u]; e != NULL; e = e->next) {
            int v = e->to;
            int w = e->weight;
            
            if (gScore[u] != INT_MAX && gScore[u] + w < gScore[v]) {
                gScore[v] = gScore[u] + w;
                int f = gScore[v] + h[v];
                Node next = {v, f, gScore[v]};
                push(openSet, next);
            }
        }
    }
    
    for (int i = 0; i < n; i++) {
        Edge* curr = adj[i];
        while (curr) {
            Edge* temp = curr;
            curr = curr->next;
            free(temp);
        }
    }
    free(adj);
    free(gScore);
    free(openSet->nodes);
    free(openSet);
    
    return cost;
}
