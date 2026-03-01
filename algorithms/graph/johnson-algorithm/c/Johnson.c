#include <stdio.h>
#include <stdlib.h>
#include <limits.h>
#include <stdbool.h>

#define MAX_NODES 100
#define MAX_EDGES 10000
#define INF INT_MAX

typedef struct {
    int src, dest, weight;
} Edge;

/**
 * Bellman-Ford helper for Johnson's algorithm.
 * Returns false if negative cycle detected.
 */
bool bellmanFord(int numVertices, Edge edges[], int numEdges, int src, long dist[]) {
    for (int i = 0; i < numVertices; i++) dist[i] = INF;
    dist[src] = 0;

    for (int i = 0; i < numVertices - 1; i++) {
        for (int j = 0; j < numEdges; j++) {
            if (dist[edges[j].src] != INF &&
                dist[edges[j].src] + edges[j].weight < dist[edges[j].dest]) {
                dist[edges[j].dest] = dist[edges[j].src] + edges[j].weight;
            }
        }
    }

    for (int j = 0; j < numEdges; j++) {
        if (dist[edges[j].src] != INF &&
            dist[edges[j].src] + edges[j].weight < dist[edges[j].dest]) {
            return false;
        }
    }
    return true;
}

/**
 * Dijkstra helper for Johnson's algorithm.
 */
void dijkstra(int numVertices, int adjList[][MAX_NODES][2], int adjCount[],
              int src, long result[]) {
    bool visited[MAX_NODES] = {false};

    for (int i = 0; i < numVertices; i++) result[i] = INF;
    result[src] = 0;

    for (int count = 0; count < numVertices; count++) {
        int u = -1;
        long minDist = INF;
        for (int i = 0; i < numVertices; i++) {
            if (!visited[i] && result[i] < minDist) {
                minDist = result[i];
                u = i;
            }
        }
        if (u == -1) break;
        visited[u] = true;

        for (int i = 0; i < adjCount[u]; i++) {
            int v = adjList[u][i][0];
            int w = adjList[u][i][1];
            if (!visited[v] && result[u] + w < result[v]) {
                result[v] = result[u] + w;
            }
        }
    }
}

char *johnson(int numVertices, int arr[]) {
    static char output[100000];
    Edge edges[MAX_EDGES];
    Edge allEdges[MAX_EDGES];
    long h[MAX_NODES];
    int adjList[MAX_NODES][MAX_NODES][2];
    int adjCount[MAX_NODES] = {0};
    int numEdges = arr[0];

    if (numVertices <= 0 || numVertices > MAX_NODES || numEdges < 0 || numEdges > MAX_EDGES - MAX_NODES) {
        output[0] = '\0';
        return output;
    }

    for (int i = 0; i < numEdges; i++) {
        int base = 1 + (3 * i);
        edges[i].src = arr[base];
        edges[i].dest = arr[base + 1];
        edges[i].weight = arr[base + 2];
        allEdges[i] = edges[i];
    }

    int totalEdges = numEdges;
    for (int i = 0; i < numVertices; i++) {
        allEdges[totalEdges++] = (Edge){numVertices, i, 0};
    }

    if (!bellmanFord(numVertices + 1, allEdges, totalEdges, numVertices, h)) {
        snprintf(output, sizeof(output), "negative_cycle");
        return output;
    }

    for (int i = 0; i < numEdges; i++) {
        int u = edges[i].src;
        int v = edges[i].dest;
        int newWeight = edges[i].weight + (int)h[u] - (int)h[v];
        if (u >= 0 && u < numVertices && v >= 0 && v < numVertices && adjCount[u] < MAX_NODES) {
            adjList[u][adjCount[u]][0] = v;
            adjList[u][adjCount[u]][1] = newWeight;
            adjCount[u]++;
        }
    }

    int offset = 0;
    output[0] = '\0';
    for (int u = 0; u < numVertices; u++) {
        long dist[MAX_NODES];
        dijkstra(numVertices, adjList, adjCount, u, dist);
        for (int v = 0; v < numVertices; v++) {
            if (dist[v] == INF) {
                offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%sInfinity",
                    (u == 0 && v == 0) ? "" : " ");
            } else {
                long actual = dist[v] - h[u] + h[v];
                offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s%ld",
                    (u == 0 && v == 0) ? "" : " ", actual);
            }
        }
    }

    return output;
}

int main() {
    int numVertices = 4;
    Edge edges[] = {{0,1,1}, {1,2,2}, {2,3,3}, {0,3,10}};
    int numEdges = 4;

    // Add virtual node connected to all vertices
    Edge allEdges[MAX_EDGES];
    int totalEdges = numEdges;
    for (int i = 0; i < numEdges; i++) allEdges[i] = edges[i];
    for (int i = 0; i < numVertices; i++) {
        allEdges[totalEdges++] = (Edge){numVertices, i, 0};
    }

    long h[MAX_NODES];
    if (!bellmanFord(numVertices + 1, allEdges, totalEdges, numVertices, h)) {
        printf("Negative cycle detected\n");
        return 0;
    }

    // Reweight edges
    int adjList[MAX_NODES][MAX_NODES][2];
    int adjCount[MAX_NODES] = {0};
    for (int i = 0; i < numEdges; i++) {
        int u = edges[i].src;
        int v = edges[i].dest;
        int newWeight = edges[i].weight + h[u] - h[v];
        adjList[u][adjCount[u]][0] = v;
        adjList[u][adjCount[u]][1] = newWeight;
        adjCount[u]++;
    }

    // Run Dijkstra from each vertex
    printf("All-pairs shortest distances:\n");
    for (int u = 0; u < numVertices; u++) {
        long dist[MAX_NODES];
        dijkstra(numVertices, adjList, adjCount, u, dist);
        printf("From %d: ", u);
        for (int v = 0; v < numVertices; v++) {
            if (dist[v] == INF) printf("INF ");
            else printf("%ld ", dist[v] - h[u] + h[v]);
        }
        printf("\n");
    }

    return 0;
}
