#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NODES 100

typedef struct {
    int node;
    int heuristic;
    int path[MAX_NODES];
    int path_len;
} HeapEntry;

typedef struct {
    HeapEntry entries[MAX_NODES * MAX_NODES];
    int size;
} MinHeap;

void heap_swap(MinHeap *heap, int i, int j) {
    HeapEntry temp = heap->entries[i];
    heap->entries[i] = heap->entries[j];
    heap->entries[j] = temp;
}

void heap_push(MinHeap *heap, HeapEntry entry) {
    int i = heap->size;
    heap->entries[i] = entry;
    heap->size++;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap->entries[parent].heuristic > heap->entries[i].heuristic) {
            heap_swap(heap, parent, i);
            i = parent;
        } else {
            break;
        }
    }
}

HeapEntry heap_pop(MinHeap *heap) {
    HeapEntry top = heap->entries[0];
    heap->size--;
    heap->entries[0] = heap->entries[heap->size];
    int i = 0;
    while (1) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int smallest = i;
        if (left < heap->size && heap->entries[left].heuristic < heap->entries[smallest].heuristic)
            smallest = left;
        if (right < heap->size && heap->entries[right].heuristic < heap->entries[smallest].heuristic)
            smallest = right;
        if (smallest != i) {
            heap_swap(heap, i, smallest);
            i = smallest;
        } else {
            break;
        }
    }
    return top;
}

int best_first_search(int adj[][MAX_NODES], int adj_count[], int num_nodes,
                      int start, int goal, int heuristic[],
                      int result_path[], int *result_len) {
    if (start == goal) {
        result_path[0] = start;
        *result_len = 1;
        return 1;
    }

    int visited[MAX_NODES];
    memset(visited, 0, sizeof(visited));

    MinHeap heap;
    heap.size = 0;

    HeapEntry start_entry;
    start_entry.node = start;
    start_entry.heuristic = heuristic[start];
    start_entry.path[0] = start;
    start_entry.path_len = 1;
    heap_push(&heap, start_entry);

    while (heap.size > 0) {
        HeapEntry current = heap_pop(&heap);

        if (current.node == goal) {
            memcpy(result_path, current.path, current.path_len * sizeof(int));
            *result_len = current.path_len;
            return 1;
        }

        if (visited[current.node])
            continue;
        visited[current.node] = 1;

        for (int i = 0; i < adj_count[current.node]; i++) {
            int neighbor = adj[current.node][i];
            if (!visited[neighbor]) {
                HeapEntry entry;
                entry.node = neighbor;
                entry.heuristic = heuristic[neighbor];
                memcpy(entry.path, current.path, current.path_len * sizeof(int));
                entry.path[current.path_len] = neighbor;
                entry.path_len = current.path_len + 1;
                heap_push(&heap, entry);
            }
        }
    }

    *result_len = 0;
    return 0;
}

int main() {
    int adj[MAX_NODES][MAX_NODES] = {{1, 2}, {3}, {3}, {}};
    int adj_count[] = {2, 1, 1, 0};
    int heuristic[] = {6, 3, 4, 0};
    int result_path[MAX_NODES];
    int result_len;

    best_first_search(adj, adj_count, 4, 0, 3, heuristic, result_path, &result_len);

    printf("Path: ");
    for (int i = 0; i < result_len; i++) {
        printf("%d ", result_path[i]);
    }
    printf("\n");

    return 0;
}
