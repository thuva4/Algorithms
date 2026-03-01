#include "bidirectional_bfs.h"
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

int bidirectional_bfs(int arr[], int size) {
    if (size < 4) return -1;
    
    int n = arr[0];
    int m = arr[1];
    int start = arr[2];
    int end = arr[3];
    
    if (size < 4 + 2 * m) return -1;
    if (start == end) return 0;
    
    Graph* g = create_graph(n);
    for (int i = 0; i < m; i++) {
        int u = arr[4 + 2 * i];
        int v = arr[4 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            add_edge(g, u, v);
        }
    }
    
    int* dist_start = (int*)malloc(n * sizeof(int));
    int* dist_end = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        dist_start[i] = -1;
        dist_end[i] = -1;
    }
    
    Queue* q_start = create_queue(n + m); // Sufficient size
    Queue* q_end = create_queue(n + m);
    
    enqueue(q_start, start);
    dist_start[start] = 0;
    
    enqueue(q_end, end);
    dist_end[end] = 0;
    
    int result = -1;
    
    while (!is_empty(q_start) && !is_empty(q_end)) {
        // Expand start
        int u = dequeue(q_start);
        if (dist_end[u] != -1) {
            result = dist_start[u] + dist_end[u];
            break;
        }
        
        for (Node* e = g->head[u]; e; e = e->next) {
            int v = e->to;
            if (dist_start[v] == -1) {
                dist_start[v] = dist_start[u] + 1;
                if (dist_end[v] != -1) {
                    result = dist_start[v] + dist_end[v];
                    goto end;
                }
                enqueue(q_start, v);
            }
        }
        
        // Expand end
        u = dequeue(q_end);
        if (dist_start[u] != -1) {
            result = dist_start[u] + dist_end[u];
            break;
        }
        
        for (Node* e = g->head[u]; e; e = e->next) {
            int v = e->to;
            if (dist_end[v] == -1) {
                dist_end[v] = dist_end[u] + 1;
                if (dist_start[v] != -1) {
                    result = dist_start[v] + dist_end[v];
                    goto end;
                }
                enqueue(q_end, v);
            }
        }
    }
    
end:
    free(dist_start);
    free(dist_end);
    free_queue(q_start);
    free_queue(q_end);
    free_graph(g);
    
    return result;
}
