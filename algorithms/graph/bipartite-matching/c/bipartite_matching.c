#include "bipartite_matching.h"
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

#define INF INT_MAX

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
    Node* e = (Node*)malloc(sizeof(Node));
    e->to = v;
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

static int* pair_u;
static int* pair_v;
static int* dist;
static int n_left, n_right;
static Graph* g;

static bool bfs() {
    int* q = (int*)malloc((n_left + 1) * sizeof(int));
    int front = 0, rear = 0;
    
    for (int u = 0; u < n_left; u++) {
        if (pair_u[u] == -1) {
            dist[u] = 0;
            q[rear++] = u;
        } else {
            dist[u] = INF;
        }
    }
    
    dist[n_left] = INF; // Dummy node for unmatched
    
    while (front < rear) {
        int u = q[front++];
        
        if (dist[u] < dist[n_left]) {
            for (Node* e = g->head[u]; e; e = e->next) {
                int v = e->to;
                int pu = pair_v[v];
                
                if (pu == -1) {
                    // Reached unmatched node in V
                    if (dist[n_left] == INF) {
                        dist[n_left] = dist[u] + 1;
                    }
                } else if (dist[pu] == INF) {
                    dist[pu] = dist[u] + 1;
                    q[rear++] = pu;
                }
            }
        }
    }
    
    free(q);
    return dist[n_left] != INF;
}

static bool dfs(int u) {
    if (u != -1) {
        for (Node* e = g->head[u]; e; e = e->next) {
            int v = e->to;
            int pu = pair_v[v];
            
            if (pu == -1 || (dist[pu] == dist[u] + 1 && dfs(pu))) {
                pair_v[v] = u;
                pair_u[u] = v;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    }
    return true;
}

int hopcroft_karp(int arr[], int size) {
    if (size < 3) return 0;
    
    n_left = arr[0];
    n_right = arr[1];
    int m = arr[2];
    
    if (size < 3 + 2 * m) return 0;
    if (n_left == 0 || n_right == 0) return 0;
    
    g = create_graph(n_left);
    for (int i = 0; i < m; i++) {
        int u = arr[3 + 2 * i];
        int v = arr[3 + 2 * i + 1];
        if (u >= 0 && u < n_left && v >= 0 && v < n_right) {
            add_edge(g, u, v);
        }
    }
    
    pair_u = (int*)malloc(n_left * sizeof(int));
    pair_v = (int*)malloc(n_right * sizeof(int));
    dist = (int*)malloc((n_left + 1) * sizeof(int));
    
    for (int i = 0; i < n_left; i++) pair_u[i] = -1;
    for (int i = 0; i < n_right; i++) pair_v[i] = -1;
    
    int matching = 0;
    while (bfs()) {
        for (int u = 0; u < n_left; u++) {
            if (pair_u[u] == -1) {
                if (dfs(u)) {
                    matching++;
                }
            }
        }
    }
    
    free(pair_u);
    free(pair_v);
    free(dist);
    free_graph(g);
    
    return matching;
}
