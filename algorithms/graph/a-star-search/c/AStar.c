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

typedef struct {
    int path[MAX_NODES];
    int pathLen;
    int cost;
} AStarResult;

/**
 * A* search algorithm to find shortest path from start to goal.
 * Uses a weighted adjacency list and heuristic function.
 */
AStarResult aStar(int numNodes, int start, int goal, int heuristic[]) {
    AStarResult result;
    result.pathLen = 0;
    result.cost = INF;

    if (start == goal) {
        result.path[0] = start;
        result.pathLen = 1;
        result.cost = 0;
        return result;
    }

    int gScore[MAX_NODES];
    int fScore[MAX_NODES];
    int cameFrom[MAX_NODES];
    bool closedSet[MAX_NODES] = {false};
    bool openSet[MAX_NODES] = {false};

    for (int i = 0; i < numNodes; i++) {
        gScore[i] = INF;
        fScore[i] = INF;
        cameFrom[i] = -1;
    }

    gScore[start] = 0;
    fScore[start] = heuristic[start];
    openSet[start] = true;

    while (true) {
        // Find node in open set with lowest fScore
        int current = -1;
        int minF = INF;
        for (int i = 0; i < numNodes; i++) {
            if (openSet[i] && fScore[i] < minF) {
                minF = fScore[i];
                current = i;
            }
        }

        if (current == -1) break; // No path found

        if (current == goal) {
            // Reconstruct path
            result.cost = gScore[goal];
            int path[MAX_NODES];
            int len = 0;
            int node = goal;
            while (node != -1) {
                path[len++] = node;
                node = cameFrom[node];
            }
            result.pathLen = len;
            for (int i = 0; i < len; i++) {
                result.path[i] = path[len - 1 - i];
            }
            return result;
        }

        openSet[current] = false;
        closedSet[current] = true;

        for (int i = 0; i < adjCount[current]; i++) {
            int neighbor = adjList[current][i].node;
            int weight = adjList[current][i].weight;

            if (closedSet[neighbor]) continue;

            int tentativeG = gScore[current] + weight;
            if (tentativeG < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeG;
                fScore[neighbor] = tentativeG + heuristic[neighbor];
                openSet[neighbor] = true;
            }
        }
    }

    // No path found
    return result;
}

int main() {
    int numNodes = 4;
    adjCount[0] = 2;
    adjList[0][0] = (Edge){1, 1};
    adjList[0][1] = (Edge){2, 4};
    adjCount[1] = 2;
    adjList[1][0] = (Edge){2, 2};
    adjList[1][1] = (Edge){3, 6};
    adjCount[2] = 1;
    adjList[2][0] = (Edge){3, 3};
    adjCount[3] = 0;

    int heuristic[] = {5, 4, 2, 0};

    AStarResult res = aStar(numNodes, 0, 3, heuristic);

    if (res.pathLen == 0) {
        printf("No path found\n");
    } else {
        printf("Path: ");
        for (int i = 0; i < res.pathLen; i++) {
            printf("%d ", res.path[i]);
        }
        printf("\nCost: %d\n", res.cost);
    }

    return 0;
}
