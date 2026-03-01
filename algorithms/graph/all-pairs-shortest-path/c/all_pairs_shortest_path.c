#include "all_pairs_shortest_path.h"
#include <stdlib.h>
#include <limits.h>

#define INF 1000000000 // Use a safe infinity to avoid overflow during addition

int all_pairs_shortest_path(int arr[], int size) {
    if (size < 2) return -1;
    
    int n = arr[0];
    int m = arr[1];
    
    if (size < 2 + 3 * m) return -1;
    if (n <= 0) return -1;
    if (n == 1) return 0; // 0 to 0 is 0

    // Allocate matrix
    int** dist = (int**)malloc(n * sizeof(int*));
    for (int i = 0; i < n; i++) {
        dist[i] = (int*)malloc(n * sizeof(int));
        for (int j = 0; j < n; j++) {
            if (i == j) dist[i][j] = 0;
            else dist[i][j] = INF;
        }
    }

    // Initialize edges
    for (int i = 0; i < m; i++) {
        int u = arr[2 + 3 * i];
        int v = arr[2 + 3 * i + 1];
        int w = arr[2 + 3 * i + 2];
        
        if (u >= 0 && u < n && v >= 0 && v < n) {
            // Keep the smallest weight if multiple edges
            if (w < dist[u][v]) {
                dist[u][v] = w;
            }
        }
    }

    // Floyd-Warshall
    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }

    int result = dist[0][n - 1];
    
    // Cleanup
    for (int i = 0; i < n; i++) {
        free(dist[i]);
    }
    free(dist);

    return (result == INF) ? -1 : result;
}
