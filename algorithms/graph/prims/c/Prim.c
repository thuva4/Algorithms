#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>

#define MAX_NODES 1000
#define INF INT_MAX

typedef struct {
    int node;
    int weight;
} Edge;

Edge adjList[MAX_NODES][MAX_NODES];
int adjCount[MAX_NODES];

/**
 * Prim's algorithm to find MST total weight.
 * Uses a weighted adjacency list.
 * Returns total weight of MST.
 */
int prim_impl(int numVertices) {
    bool inMST[MAX_NODES] = {false};
    int key[MAX_NODES];

    for (int i = 0; i < numVertices; i++) {
        key[i] = INF;
    }
    key[0] = 0;

    int totalWeight = 0;

    for (int count = 0; count < numVertices; count++) {
        // Find minimum key vertex not in MST
        int u = -1;
        int minKey = INF;
        for (int i = 0; i < numVertices; i++) {
            if (!inMST[i] && key[i] < minKey) {
                minKey = key[i];
                u = i;
            }
        }

        if (u == -1) break;

        inMST[u] = true;
        totalWeight += key[u];

        // Update keys of adjacent vertices
        for (int i = 0; i < adjCount[u]; i++) {
            int v = adjList[u][i].node;
            int w = adjList[u][i].weight;
            if (!inMST[v] && w < key[v]) {
                key[v] = w;
            }
        }
    }

    return totalWeight;
}

int prim(int numVertices, int arr[]) {
    int numEdges = arr[1];
    for (int i = 0; i < numVertices; i++) {
        adjCount[i] = 0;
    }

    for (int i = 0; i < numEdges; i++) {
        int base = 2 + (3 * i);
        int u = arr[base];
        int v = arr[base + 1];
        int w = arr[base + 2];
        if (u >= 0 && u < numVertices && adjCount[u] < MAX_NODES) {
            adjList[u][adjCount[u]].node = v;
            adjList[u][adjCount[u]].weight = w;
            adjCount[u]++;
        }
    }

    return prim_impl(numVertices);
}

int main() {
    // Example: {"0": [[1,10],[2,6],[3,5]], "1": [[0,10],[3,15]], "2": [[0,6],[3,4]], "3": [[0,5],[1,15],[2,4]]}
    int numVertices = 4;

    adjCount[0] = 3;
    adjList[0][0] = (Edge){1, 10};
    adjList[0][1] = (Edge){2, 6};
    adjList[0][2] = (Edge){3, 5};

    adjCount[1] = 2;
    adjList[1][0] = (Edge){0, 10};
    adjList[1][1] = (Edge){3, 15};

    adjCount[2] = 2;
    adjList[2][0] = (Edge){0, 6};
    adjList[2][1] = (Edge){3, 4};

    adjCount[3] = 3;
    adjList[3][0] = (Edge){0, 5};
    adjList[3][1] = (Edge){1, 15};
    adjList[3][2] = (Edge){2, 4};

    int result = prim_impl(numVertices);
    printf("MST total weight: %d\n", result);

    return 0;
}
