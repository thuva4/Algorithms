#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

#define MAX_EDGES 10000
#define INF INT_MAX

typedef struct {
    int src;
    int dest;
    int weight;
} Edge;

/**
 * Bellman-Ford algorithm to find shortest paths from a start node.
 * Detects negative weight cycles.
 * Results stored in dist[]. Returns false if negative cycle detected.
 */
bool bellmanFord(int numVertices, Edge edges[], int numEdges, int startNode, int dist[]) {
    for (int i = 0; i < numVertices; i++) {
        dist[i] = INF;
    }
    dist[startNode] = 0;

    // Relax all edges V-1 times
    for (int i = 0; i < numVertices - 1; i++) {
        for (int j = 0; j < numEdges; j++) {
            int u = edges[j].src;
            int v = edges[j].dest;
            int w = edges[j].weight;
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    // Check for negative weight cycles
    for (int j = 0; j < numEdges; j++) {
        int u = edges[j].src;
        int v = edges[j].dest;
        int w = edges[j].weight;
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            return false; // Negative cycle detected
        }
    }

    return true;
}

int main() {
    int numVertices = 4;
    Edge edges[] = {
        {0, 1, 4},
        {0, 2, 1},
        {2, 1, 2},
        {1, 3, 1},
        {2, 3, 5}
    };
    int numEdges = 5;
    int dist[4];

    if (bellmanFord(numVertices, edges, numEdges, 0, dist)) {
        printf("Shortest distances from node 0:\n");
        for (int i = 0; i < numVertices; i++) {
            if (dist[i] == INF)
                printf("Node %d: Infinity\n", i);
            else
                printf("Node %d: %d\n", i, dist[i]);
        }
    } else {
        printf("Negative cycle detected\n");
    }

    return 0;
}
