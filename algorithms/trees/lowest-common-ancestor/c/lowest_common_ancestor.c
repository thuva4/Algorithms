#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "lowest_common_ancestor.h"

#define MAXLOG 20

int lowest_common_ancestor(int* arr, int size) {
    int idx = 0;
    int n = arr[idx++];
    int root = arr[idx++];
    int i, k;

    int** adjList = (int**)malloc(n * sizeof(int*));
    int* adjCnt = (int*)calloc(n, sizeof(int));
    int* adjCap = (int*)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) { adjList[i] = (int*)malloc(4 * sizeof(int)); adjCap[i] = 4; }

    for (i = 0; i < n - 1; i++) {
        int u = arr[idx++], v = arr[idx++];
        if (adjCnt[u] >= adjCap[u]) { adjCap[u] *= 2; adjList[u] = (int*)realloc(adjList[u], adjCap[u] * sizeof(int)); }
        adjList[u][adjCnt[u]++] = v;
        if (adjCnt[v] >= adjCap[v]) { adjCap[v] *= 2; adjList[v] = (int*)realloc(adjList[v], adjCap[v] * sizeof(int)); }
        adjList[v][adjCnt[v]++] = u;
    }
    int qa = arr[idx++], qb = arr[idx++];

    int LOG = 1;
    while ((1 << LOG) < n) LOG++;
    if (LOG > MAXLOG) LOG = MAXLOG;

    int* depth = (int*)calloc(n, sizeof(int));
    int** up = (int**)malloc(LOG * sizeof(int*));
    for (k = 0; k < LOG; k++) {
        up[k] = (int*)malloc(n * sizeof(int));
        memset(up[k], -1, n * sizeof(int));
    }

    int* visited = (int*)calloc(n, sizeof(int));
    int* queue = (int*)malloc(n * sizeof(int));
    int front = 0, back = 0;
    visited[root] = 1;
    up[0][root] = root;
    queue[back++] = root;
    while (front < back) {
        int v = queue[front++];
        for (i = 0; i < adjCnt[v]; i++) {
            int u = adjList[v][i];
            if (!visited[u]) {
                visited[u] = 1;
                depth[u] = depth[v] + 1;
                up[0][u] = v;
                queue[back++] = u;
            }
        }
    }

    for (k = 1; k < LOG; k++)
        for (i = 0; i < n; i++)
            up[k][i] = up[k-1][up[k-1][i]];

    int a = qa, b = qb;
    if (depth[a] < depth[b]) { int t = a; a = b; b = t; }
    int diff = depth[a] - depth[b];
    for (k = 0; k < LOG; k++)
        if ((diff >> k) & 1) a = up[k][a];
    if (a != b) {
        for (k = LOG - 1; k >= 0; k--)
            if (up[k][a] != up[k][b]) { a = up[k][a]; b = up[k][b]; }
        a = up[0][a];
    }

    for (i = 0; i < n; i++) free(adjList[i]);
    free(adjList); free(adjCnt); free(adjCap);
    free(depth); free(visited); free(queue);
    for (k = 0; k < LOG; k++) free(up[k]);
    free(up);

    return a;
}

int main() {
    int a1[] = {5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2};
    printf("%d\n", lowest_common_ancestor(a1, 12)); /* 0 */

    int a2[] = {5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3};
    printf("%d\n", lowest_common_ancestor(a2, 12)); /* 1 */

    int a3[] = {3, 0, 0, 1, 0, 2, 2, 2};
    printf("%d\n", lowest_common_ancestor(a3, 8)); /* 2 */

    int a4[] = {5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4};
    printf("%d\n", lowest_common_ancestor(a4, 12)); /* 1 */

    return 0;
}
