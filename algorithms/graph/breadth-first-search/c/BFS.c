#include "bfs.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

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

typedef struct {
    int* data;
    int front, rear, capacity;
} Queue;

static Queue* create_queue(int capacity) {
    Queue* q = (Queue*)malloc(sizeof(Queue));
    q->data = (int*)malloc(capacity * sizeof(int));
    q->front = 0;
    q->rear = 0;
    q->capacity = capacity;
    return q;
}

static void enqueue(Queue* q, int val) {
    q->data[q->rear++] = val;
}

static int dequeue(Queue* q) {
    return q->data[q->front++];
}

static bool is_empty(Queue* q) {
    return q->front == q->rear;
}

static void free_queue(Queue* q) {
    free(q->data);
    free(q);
}

// Helper to sort array for deterministic output
static int compare_ints(const void* a, const void* b) {
    return (*(int*)a - *(int*)b);
}

void bfs(int arr[], int size, int** result, int* result_size) {
    if (size < 2) {
        *result_size = 0;
        return;
    }
    
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 2 * m + 1) {
        *result_size = 0;
        return;
    }
    
    int start = arr[2 + 2 * m];
    if (start < 0 || start >= n) {
        *result_size = 0;
        return;
    }
    
    Graph* g = create_graph(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(g, u, v);
        }
    }
    
    // Sort neighbors for deterministic traversal
    for (int i = 0; i < n; i++) {
        int count = 0;
        for (Node* curr = g->head[i]; curr; curr = curr->next) count++;
        
        if (count > 1) {
            int* neighbors = (int*)malloc(count * sizeof(int));
            int idx = 0;
            for (Node* curr = g->head[i]; curr; curr = curr->next) neighbors[idx++] = curr->to;
            
            qsort(neighbors, count, sizeof(int), compare_ints);
            
            // Rebuild list sorted
            Node* curr = g->head[i];
            for (int k = count - 1; k >= 0; k--) {
                curr = g->head[i]; // Need to free existing list structure or reuse
                // Easier to rebuild: let's just create a temporary array and rebuild linked list from scratch?
                // Or just reuse nodes.
                // Reusing nodes is cleaner.
            }
            // Wait, linked list structure. Rebuilding:
            // Free current list nodes and re-add.
            // But freeing is O(deg).
            
            // Simplest: just store sorted neighbors back.
            Node* temp = g->head[i];
            g->head[i] = NULL;
            // Free old nodes
            while(temp) {
                Node* next = temp->next;
                free(temp);
                temp = next;
            }
            // Add new nodes in reverse order so they appear in correct order
            for (int k = count - 1; k >= 0; k--) {
                Node* e = (Node*)malloc(sizeof(Node));
                e->to = neighbors[k];
                e->next = g->head[i];
                g->head[i] = e;
            }
            
            free(neighbors);
        }
    }
    
    bool* visited = (bool*)calloc(n, sizeof(bool));
    Queue* q = create_queue(n);
    int* res = (int*)malloc(n * sizeof(int));
    int res_idx = 0;
    
    visited[start] = true;
    enqueue(q, start);
    
    while (!is_empty(q)) {
        int u = dequeue(q);
        res[res_idx++] = u;
        
        for (Node* e = g->head[u]; e; e = e->next) {
            int v = e->to;
            if (!visited[v]) {
                visited[v] = true;
                enqueue(q, v);
            }
        }
    }
    
    free(visited);
    free_queue(q);
    free_graph(g);
    
    *result = res;
    *result_size = res_idx;
}
