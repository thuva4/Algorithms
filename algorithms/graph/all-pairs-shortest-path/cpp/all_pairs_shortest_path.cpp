#include "all_pairs_shortest_path.h"
#include <vector>
#include <algorithm>

const int INF = 1000000000;

int all_pairs_shortest_path(const std::vector<int>& arr) {
    if (arr.size() < 2) return -1;
    
    int n = arr[0];
    int m = arr[1];
    
    if (arr.size() < 2 + 3 * m) return -1;
    if (n <= 0) return -1;
    if (n == 1) return 0;

    std::vector<std::vector<int>> dist(n, std::vector<int>(n, INF));

    for (int i = 0; i < n; i++) dist[i][i] = 0;

    for (int i = 0; i < m; i++) {
        int u = arr[2 + 3 * i];
        int v = arr[2 + 3 * i + 1];
        int w = arr[2 + 3 * i + 2];
        
        if (u >= 0 && u < n && v >= 0 && v < n) {
            dist[u][v] = std::min(dist[u][v], w);
        }
    }

    for (int k = 0; k < n; k++) {
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (dist[i][k] != INF && dist[k][j] != INF) {
                    dist[i][j] = std::min(dist[i][j], dist[i][k] + dist[k][j]);
                }
            }
        }
    }

    return (dist[0][n - 1] == INF) ? -1 : dist[0][n - 1];
}
