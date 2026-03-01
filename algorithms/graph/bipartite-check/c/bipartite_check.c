#include "bipartite_check.h"
#include <stdlib.h>
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

int is_bipartite(int arr[], int size) {
    if (size < 2) return 0;
    
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 2 * m) return 0;
    if (n == 0) return 1;
    
    Graph* g = create_graph(n);
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(g, u, v);
        }
    }
    
    int* color = (int*)calloc(n, sizeof(int)); // 0: none, 1: red, -1: blue
    Queue* q = create_queue(n);
    int result = 1;
    
    for (int i = 0; i < n; i++) {
        if (color[i] == 0) {
            color[i] = 1;
            enqueue(q, i);
            
            while (!is_empty(q)) {
                int u = dequeue(q);
                
                for (Node* e = g->head[u]; e; e = e->next) {
                    int v = e->to;
                    if (color[v] == 0) {
                        color[v] = -color[u];
                        enqueue(q, v);
                    } else if (color[v] == color[u]) {
                        result = 0;
                        goto end;
                    }
                }
            }
            
            // Reset queue for next component reuse or just continue
            // Actually queue is empty here
            q->front = q->rear = 0; 
        }
    }
    
end:
    free(color);
    free_queue(q);
    free_graph(g);
    
    return result;
}
