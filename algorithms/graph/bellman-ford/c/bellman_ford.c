#include "bellman_ford.h"
#include <stdlib.h>
#include <stdio.h>
#include <limits.h>

#define INF 1000000000

typedef struct {
    int u, v, w;
} Edge;

void bellman_ford(int arr[], int size, int** result, int* result_size) {
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
    
    Edge* edges = (Edge*)malloc(m * sizeof(Edge));
    for (int i = 0; i < m; i++) {
        edges[i].u = arr[2 + 3 * i];
        edges[i].v = arr[2 + 3 * i + 1];
        edges[i].w = arr[2 + 3 * i + 2];
    }
    
    int* dist = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) dist[i] = INF;
    dist[start] = 0;
    
    // Relax edges N-1 times
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < m; j++) {
            int u = edges[j].u;
            int v = edges[j].v;
            int w = edges[j].w;
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycles
    for (int j = 0; j < m; j++) {
        int u = edges[j].u;
        int v = edges[j].v;
        int w = edges[j].w;
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            // Negative cycle found
            free(edges);
            free(dist);
            *result_size = 0;
            *result = NULL;
            return;
        }
    }
    
    free(edges);
    *result = dist;
    *result_size = n;
}
