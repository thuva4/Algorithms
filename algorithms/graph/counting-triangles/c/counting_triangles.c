#include "counting_triangles.h"
#include <stdlib.h>
#include <stdbool.h>

int counting_triangles(int arr[], int size) {
    if (size < 2) return 0;
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 2 * m) return 0;
    if (n < 3) return 0;
    
    // Adjacency Matrix
    bool** adj = (bool**)malloc(n * sizeof(bool*));
    for (int i = 0; i < n; i++) {
        adj[i] = (bool*)calloc(n, sizeof(bool));
    }
    
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 2 * i];
        int v = arr[2 + 2 * i + 1];
        if (u >= 0 && u < n && v >= 0 && v < n) {
            adj[u][v] = true;
            adj[v][u] = true;
        }
    }
    
    int count = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (adj[i][j]) {
                for (int k = j + 1; k < n; k++) {
                    if (adj[j][k] && adj[k][i]) {
                        count++;
                    }
                }
            }
        }
    }
    
    for (int i = 0; i < n; i++) {
        free(adj[i]);
    }
    free(adj);
    
    return count;
}
