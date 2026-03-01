#include "connected_components.h"
#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>

#define MIN(a,b) (((a)<(b))?(a):(b))

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

void connected_components(int arr[], int size, int** result, int* result_size) {
    if (size < 2) {
        *result_size = 0;
        return;
    }
    
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 2 * m) {
        *result_size = 0;
        return;
    }
    if (n == 0) {
        *result_size = 0;
        *result = NULL;
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
    
    int* labels = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) labels[i] = -1;
    
    Queue* q = create_queue(n);
    
    for (int i = 0; i < n; i++) {
        if (labels[i] == -1) {
            int component_id = i; // Smallest index as ID
            labels[i] = component_id;
            enqueue(q, i);
            
            while (!is_empty(q)) {
                int u = dequeue(q);
                // Keep component_id as min seen? No, i is smallest because iterating 0..n-1
                
                for (Node* e = g->head[u]; e; e = e->next) {
                    int v = e->to;
                    if (labels[v] == -1) {
                        labels[v] = component_id;
                        enqueue(q, v);
                    }
                }
            }
            
            q->front = q->rear = 0;
        }
    }
    
    free_queue(q);
    free_graph(g);
    
    *result = labels;
    *result_size = n;
}
