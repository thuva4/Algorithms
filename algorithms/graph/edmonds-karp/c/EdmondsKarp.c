#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <string.h>

#define MAX_NODES 100

int capacity[MAX_NODES][MAX_NODES];
int parent[MAX_NODES];

bool bfs(int source, int sink, int n) {
    bool visited[MAX_NODES];
    memset(visited, false, sizeof(visited));

    int queue[MAX_NODES];
    int front = 0, rear = 0;

    queue[rear++] = source;
    visited[source] = true;
    parent[source] = -1;

    while (front < rear) {
        int u = queue[front++];
        for (int v = 0; v < n; v++) {
            if (!visited[v] && capacity[u][v] > 0) {
                queue[rear++] = v;
                parent[v] = u;
                visited[v] = true;
                if (v == sink) return true;
            }
        }
    }
    return false;
}

/**
 * Edmonds-Karp algorithm (BFS-based Ford-Fulkerson) for maximum flow.
 * Returns the maximum flow from source to sink.
 */
int edmondsKarp(int n, int source, int sink) {
    if (source == sink) return 0;

    int maxFlow = 0;

    while (bfs(source, sink, n)) {
        // Find minimum capacity along the path
        int pathFlow = INT_MAX;
        for (int v = sink; v != source; v = parent[v]) {
            int u = parent[v];
            if (capacity[u][v] < pathFlow) {
                pathFlow = capacity[u][v];
            }
        }

        // Update capacities
        for (int v = sink; v != source; v = parent[v]) {
            int u = parent[v];
            capacity[u][v] -= pathFlow;
            capacity[v][u] += pathFlow;
        }

        maxFlow += pathFlow;
    }

    return maxFlow;
}

int edmonds_karp(int arr[], int size, int source, int sink) {
    int n = 0;
    while (n * n < size) {
        n++;
    }
    if (n * n != size || n > MAX_NODES) {
        return 0;
    }

    memset(capacity, 0, sizeof(capacity));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            capacity[i][j] = arr[i * n + j];
        }
    }

    return edmondsKarp(n, source, sink);
}

int main() {
    int n = 6;
    memset(capacity, 0, sizeof(capacity));

    capacity[0][1] = 10; capacity[0][2] = 10;
    capacity[1][2] = 2;  capacity[1][3] = 4;  capacity[1][4] = 8;
    capacity[2][4] = 9;
    capacity[3][5] = 10;
    capacity[4][3] = 6;  capacity[4][5] = 10;

    int result = edmondsKarp(n, 0, 5);
    printf("Maximum flow: %d\n", result);

    return 0;
}
