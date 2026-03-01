#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <limits.h>
#include <float.h>

#define MAX_NODES 100

typedef struct {
    int node;
    int weight;
} Edge;

Edge adjList[MAX_NODES][MAX_NODES];
int adjCount[MAX_NODES];
bool visited[MAX_NODES];
int topoOrder[MAX_NODES];
int topoCount;

void dfs(int node) {
    visited[node] = true;
    for (int i = 0; i < adjCount[node]; i++) {
        if (!visited[adjList[node][i].node]) {
            dfs(adjList[node][i].node);
        }
    }
    topoOrder[topoCount++] = node;
}

/**
 * Longest path in a DAG from a start node.
 * Uses topological sort followed by relaxation.
 * Results stored in dist[]. Uses -DBL_MAX for unreachable nodes.
 */
void longestPath(int numNodes, int startNode, double dist[]) {
    // Topological sort
    topoCount = 0;
    for (int i = 0; i < numNodes; i++) visited[i] = false;
    for (int i = 0; i < numNodes; i++) {
        if (!visited[i]) dfs(i);
    }

    // Initialize distances
    for (int i = 0; i < numNodes; i++) dist[i] = -DBL_MAX;
    dist[startNode] = 0;

    // Process in reverse topological order (which gives correct topological order)
    for (int i = topoCount - 1; i >= 0; i--) {
        int u = topoOrder[i];
        if (dist[u] != -DBL_MAX) {
            for (int j = 0; j < adjCount[u]; j++) {
                int v = adjList[u][j].node;
                int w = adjList[u][j].weight;
                if (dist[u] + w > dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
    }
}

char *longest_path(int arr[], int size, int startNode) {
    static char output[100000];
    double dist[MAX_NODES];
    int numNodes = size > 0 ? arr[0] : 0;
    int numEdges = size > 1 ? arr[1] : 0;

    for (int i = 0; i < MAX_NODES; i++) {
        adjCount[i] = 0;
    }

    for (int i = 0; i < numEdges; i++) {
        int base = 2 + (3 * i);
        if (base + 2 >= size) {
            break;
        }
        int u = arr[base];
        int v = arr[base + 1];
        int w = arr[base + 2];
        if (u >= 0 && u < MAX_NODES && v >= 0 && v < MAX_NODES && adjCount[u] < MAX_NODES) {
            adjList[u][adjCount[u]].node = v;
            adjList[u][adjCount[u]].weight = w;
            adjCount[u]++;
        }
    }

    if (numNodes == 0) {
        numNodes = startNode + 1;
    }
    if (numNodes < 0) {
        output[0] = '\0';
        return output;
    }

    longestPath(numNodes, startNode, dist);

    int offset = 0;
    output[0] = '\0';
    for (int i = 0; i < numNodes; i++) {
        if (dist[i] == -DBL_MAX) {
            offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s-Infinity",
                i == 0 ? "" : " ");
        } else {
            offset += snprintf(output + offset, sizeof(output) - (size_t)offset, "%s%.0f",
                i == 0 ? "" : " ", dist[i]);
        }
    }
    return output;
}

int main() {
    int numNodes = 4;
    adjCount[0] = 2;
    adjList[0][0] = (Edge){1, 3};
    adjList[0][1] = (Edge){2, 6};
    adjCount[1] = 2;
    adjList[1][0] = (Edge){3, 4};
    adjList[1][1] = (Edge){2, 4};
    adjCount[2] = 1;
    adjList[2][0] = (Edge){3, 2};
    adjCount[3] = 0;

    double dist[MAX_NODES];
    longestPath(numNodes, 0, dist);

    printf("Longest distances from node 0:\n");
    for (int i = 0; i < numNodes; i++) {
        if (dist[i] == -DBL_MAX)
            printf("Node %d: -Infinity\n", i);
        else
            printf("Node %d: %.0f\n", i, dist[i]);
    }

    return 0;
}
