#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_NODES 1000

int adjList[MAX_NODES][MAX_NODES];
int adjCount[MAX_NODES];
int revAdj[MAX_NODES][MAX_NODES];
int revAdjCount[MAX_NODES];
bool visited[MAX_NODES];
int finishOrder[MAX_NODES];
int finishCount;
int components[MAX_NODES][MAX_NODES];
int componentSizes[MAX_NODES];
int numComponents;

void dfs1(int node) {
    visited[node] = true;
    for (int i = 0; i < adjCount[node]; i++) {
        int neighbor = adjList[node][i];
        if (!visited[neighbor]) {
            dfs1(neighbor);
        }
    }
    finishOrder[finishCount++] = node;
}

void dfs2(int node, int comp) {
    visited[node] = true;
    components[comp][componentSizes[comp]++] = node;
    for (int i = 0; i < revAdjCount[node]; i++) {
        int neighbor = revAdj[node][i];
        if (!visited[neighbor]) {
            dfs2(neighbor, comp);
        }
    }
}

/**
 * Kosaraju's algorithm to find strongly connected components.
 * Returns the number of SCCs found. Components are stored in components[][].
 */
int findSCCs(int numNodes) {
    finishCount = 0;
    numComponents = 0;

    // First pass: DFS on original graph
    for (int i = 0; i < numNodes; i++) visited[i] = false;
    for (int i = 0; i < numNodes; i++) {
        if (!visited[i]) {
            dfs1(i);
        }
    }

    // Second pass: DFS on reversed graph in reverse finish order
    for (int i = 0; i < numNodes; i++) visited[i] = false;
    for (int i = finishCount - 1; i >= 0; i--) {
        int node = finishOrder[i];
        if (!visited[node]) {
            componentSizes[numComponents] = 0;
            dfs2(node, numComponents);
            numComponents++;
        }
    }

    return numComponents;
}

int main() {
    int numNodes = 5;

    // Graph: 0->1, 1->2, 2->0, 2->3, 3->4, 4->3
    adjCount[0] = 1; adjList[0][0] = 1;
    adjCount[1] = 1; adjList[1][0] = 2;
    adjCount[2] = 2; adjList[2][0] = 0; adjList[2][1] = 3;
    adjCount[3] = 1; adjList[3][0] = 4;
    adjCount[4] = 1; adjList[4][0] = 3;

    // Build reverse graph
    for (int i = 0; i < numNodes; i++) revAdjCount[i] = 0;
    for (int u = 0; u < numNodes; u++) {
        for (int i = 0; i < adjCount[u]; i++) {
            int v = adjList[u][i];
            revAdj[v][revAdjCount[v]++] = u;
        }
    }

    int count = findSCCs(numNodes);
    printf("Number of SCCs: %d\n", count);
    for (int i = 0; i < count; i++) {
        printf("SCC %d: ", i);
        for (int j = 0; j < componentSizes[i]; j++) {
            printf("%d ", components[i][j]);
        }
        printf("\n");
    }

    return 0;
}
