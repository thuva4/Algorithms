#include <stdio.h>
#include <stdlib.h>
#include "centroid_decomposition.h"

static int** adjList;
static int* adjCnt;
static int* removed;
static int* sub_size;

static void get_sub_size(int v, int parent) {
    sub_size[v] = 1;
    int i;
    for (i = 0; i < adjCnt[v]; i++) {
        int u = adjList[v][i];
        if (u != parent && !removed[u]) {
            get_sub_size(u, v);
            sub_size[v] += sub_size[u];
        }
    }
}

static int get_centroid(int v, int parent, int tree_size) {
    int i;
    for (i = 0; i < adjCnt[v]; i++) {
        int u = adjList[v][i];
        if (u != parent && !removed[u] && sub_size[u] > tree_size / 2)
            return get_centroid(u, v, tree_size);
    }
    return v;
}

static int decompose(int v, int depth) {
    get_sub_size(v, -1);
    int centroid = get_centroid(v, -1, sub_size[v]);
    removed[centroid] = 1;

    int max_depth = depth;
    int i;
    for (i = 0; i < adjCnt[centroid]; i++) {
        int u = adjList[centroid][i];
        if (!removed[u]) {
            int result = decompose(u, depth + 1);
            if (result > max_depth) max_depth = result;
        }
    }

    removed[centroid] = 0;
    return max_depth;
}

int centroid_decomposition(int* arr, int size) {
    int idx = 0;
    int n = arr[idx++];
    if (n <= 1) return 0;
    int i;

    int m = (size - 1) / 2;
    adjList = (int**)malloc(n * sizeof(int*));
    adjCnt = (int*)calloc(n, sizeof(int));
    int* adjCap = (int*)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) { adjList[i] = (int*)malloc(4 * sizeof(int)); adjCap[i] = 4; }

    for (i = 0; i < m; i++) {
        int u = arr[idx++], v = arr[idx++];
        if (adjCnt[u] >= adjCap[u]) { adjCap[u] *= 2; adjList[u] = (int*)realloc(adjList[u], adjCap[u] * sizeof(int)); }
        adjList[u][adjCnt[u]++] = v;
        if (adjCnt[v] >= adjCap[v]) { adjCap[v] *= 2; adjList[v] = (int*)realloc(adjList[v], adjCap[v] * sizeof(int)); }
        adjList[v][adjCnt[v]++] = u;
    }

    removed = (int*)calloc(n, sizeof(int));
    sub_size = (int*)malloc(n * sizeof(int));
    int result = decompose(0, 0);

    for (i = 0; i < n; i++) free(adjList[i]);
    free(adjList); free(adjCnt); free(adjCap); free(removed); free(sub_size);
    return result;
}

int main() {
    int a1[] = {4, 0, 1, 1, 2, 2, 3};
    printf("%d\n", centroid_decomposition(a1, 7));

    int a2[] = {5, 0, 1, 0, 2, 0, 3, 0, 4};
    printf("%d\n", centroid_decomposition(a2, 9));

    int a3[] = {1};
    printf("%d\n", centroid_decomposition(a3, 1));

    int a4[] = {7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6};
    printf("%d\n", centroid_decomposition(a4, 13));

    return 0;
}
