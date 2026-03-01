#include "best_first_search.h"
#include <stdlib.h>
#include <stdbool.h>

// Simple Priority Queue implementation
typedef struct {
    int node;
    int priority;
} PQNode;

typedef struct {
    PQNode *nodes;
    int size;
    int capacity;
} PriorityQueue;

static PriorityQueue* createPQ(int capacity) {
    PriorityQueue* pq = (PriorityQueue*)malloc(sizeof(PriorityQueue));
    pq->nodes = (PQNode*)malloc(sizeof(PQNode) * capacity);
    pq->size = 0;
    pq->capacity = capacity;
    return pq;
}

static void pushPQ(PriorityQueue* pq, int node, int priority) {
    if (pq->size == pq->capacity) return;
    int i = pq->size++;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (pq->nodes[p].priority <= priority) break;
        pq->nodes[i] = pq->nodes[p];
        i = p;
    }
    pq->nodes[i].node = node;
    pq->nodes[i].priority = priority;
}

static PQNode popPQ(PriorityQueue* pq) {
    PQNode min = pq->nodes[0];
    PQNode last = pq->nodes[--pq->size];
    int i = 0;
    while (i * 2 + 1 < pq->size) {
        int left = i * 2 + 1;
        int right = i * 2 + 2;
        int smallest = left;
        if (right < pq->size && pq->nodes[right].priority < pq->nodes[left].priority)
            smallest = right;
        if (pq->nodes[smallest].priority >= last.priority) break;
        pq->nodes[i] = pq->nodes[smallest];
        i = smallest;
    }
    pq->nodes[i] = last;
    return min;
}

static bool isEmptyPQ(PriorityQueue* pq) {
    return pq->size == 0;
}

static void freePQ(PriorityQueue* pq) {
    free(pq->nodes);
    free(pq);
}

// Graph structure
// Adjacency Matrix for simplicity in C, assuming nodes are 0..n-1
bool best_first_search(int n, int** adj, int start, int target, int* heuristic, int* path, int* path_len) {
    PriorityQueue* pq = createPQ(n * n); // Sufficient capacity
    bool visited[n];
    int parent[n];
    for (int i = 0; i < n; i++) {
        visited[i] = false;
        parent[i] = -1;
    }

    pushPQ(pq, start, heuristic[start]);
    visited[start] = true;

    bool found = false;
    while (!isEmptyPQ(pq)) {
        PQNode current = popPQ(pq);
        int u = current.node;

        if (u == target) {
            found = true;
            break;
        }

        for (int v = 0; v < n; v++) {
            if (adj[u][v] && !visited[v]) {
                visited[v] = true;
                parent[v] = u;
                pushPQ(pq, v, heuristic[v]);
            }
        }
    }

    freePQ(pq);

    if (found) {
        int curr = target;
        int count = 0;
        while (curr != -1) {
            path[count++] = curr;
            curr = parent[curr];
        }
        // Reverse path
        for (int i = 0; i < count / 2; i++) {
            int temp = path[i];
            path[i] = path[count - 1 - i];
            path[count - 1 - i] = temp;
        }
        *path_len = count;
        return true;
    }

    *path_len = 0;
    return false;
}
