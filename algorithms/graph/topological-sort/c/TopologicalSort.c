#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_NODES 1000

int adjList[MAX_NODES][MAX_NODES];
int adjCount[MAX_NODES];
bool visited[MAX_NODES];
int stack[MAX_NODES];
int stackTop;

void dfs(int node) {
    visited[node] = true;

    for (int i = adjCount[node] - 1; i >= 0; i--) {
        int neighbor = adjList[node][i];
        if (!visited[neighbor]) {
            dfs(neighbor);
        }
    }

    stack[stackTop++] = node;
}

/**
 * Topological sort of a directed acyclic graph.
 * Uses DFS-based approach.
 * Stores result in result[], returns number of nodes.
 */
int topologicalSort(int numNodes, int result[]) {
    stackTop = 0;

    for (int i = 0; i < numNodes; i++) {
        visited[i] = false;
    }

    for (int i = numNodes - 1; i >= 0; i--) {
        if (!visited[i]) {
            dfs(i);
        }
    }

    // Reverse the stack to get topological order
    int count = 0;
    for (int i = stackTop - 1; i >= 0; i--) {
        result[count++] = stack[i];
    }
    return count;
}

int main() {
    // Example: {"0": [1, 2], "1": [3], "2": [3], "3": []}
    int numNodes = 4;
    adjCount[0] = 2; adjList[0][0] = 1; adjList[0][1] = 2;
    adjCount[1] = 1; adjList[1][0] = 3;
    adjCount[2] = 1; adjList[2][0] = 3;
    adjCount[3] = 0;

    int result[MAX_NODES];
    int count = topologicalSort(numNodes, result);

    printf("Topological order: ");
    for (int i = 0; i < count; i++) {
        printf("%d ", result[i]);
    }
    printf("\n");

    return 0;
}
