#include <stdlib.h>

typedef struct {
    int src;
    int dest;
    int weight;
} Edge;

static int parent_set[1000];
static int rank_set[1000];

static int find_set(int x) {
    if (parent_set[x] != x) {
        parent_set[x] = find_set(parent_set[x]);
    }
    return parent_set[x];
}

static void union_set(int a, int b) {
    int root_a = find_set(a);
    int root_b = find_set(b);

    if (root_a == root_b) {
        return;
    }

    if (rank_set[root_a] < rank_set[root_b]) {
        parent_set[root_a] = root_b;
    } else if (rank_set[root_a] > rank_set[root_b]) {
        parent_set[root_b] = root_a;
    } else {
        parent_set[root_b] = root_a;
        rank_set[root_a]++;
    }
}

static int compare_edges(const void *left, const void *right) {
    const Edge *a = (const Edge *)left;
    const Edge *b = (const Edge *)right;
    return a->weight - b->weight;
}

int kruskal(int numVertices, int arr[]) {
    Edge edges[1000];
    int numEdges = arr[0];
    int totalWeight = 0;
    int used = 0;

    if (numEdges > 1000) {
        numEdges = 1000;
    }

    for (int i = 0; i < numVertices && i < 1000; i++) {
        parent_set[i] = i;
        rank_set[i] = 0;
    }

    for (int i = 0; i < numEdges; i++) {
        int base = 1 + (3 * i);
        edges[i].src = arr[base];
        edges[i].dest = arr[base + 1];
        edges[i].weight = arr[base + 2];
    }

    qsort(edges, (size_t)numEdges, sizeof(Edge), compare_edges);

    for (int i = 0; i < numEdges && used < numVertices - 1; i++) {
        int u = edges[i].src;
        int v = edges[i].dest;
        if (u < 0 || u >= numVertices || v < 0 || v >= numVertices) {
            continue;
        }
        if (find_set(u) != find_set(v)) {
            totalWeight += edges[i].weight;
            union_set(u, v);
            used++;
        }
    }

    return totalWeight;
}
