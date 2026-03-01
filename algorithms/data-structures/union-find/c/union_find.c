#include <stdlib.h>

static int uf_root(int parent[], int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
    }
    return x;
}

static void uf_union(int parent[], int rank[], int a, int b) {
    int ra = uf_root(parent, a);
    int rb = uf_root(parent, b);
    if (ra == rb) {
        return;
    }
    if (rank[ra] < rank[rb]) {
        parent[ra] = rb;
    } else if (rank[ra] > rank[rb]) {
        parent[rb] = ra;
    } else {
        parent[rb] = ra;
        rank[ra]++;
    }
}

int* union_find_operations(int arr[], int size, int* out_size) {
    if (size < 1) {
        *out_size = 0;
        return NULL;
    }

    int n = arr[0];
    if (n < 0) {
        *out_size = 0;
        return NULL;
    }

    int remaining = size - 1;
    if (remaining < 0 || (remaining % 3) != 0) {
        *out_size = 0;
        return NULL;
    }

    int op_count = remaining / 3;
    int *parent = (int *)malloc((n > 0 ? n : 1) * sizeof(int));
    int *rank = (int *)calloc((n > 0 ? n : 1), sizeof(int));
    int *result = (int *)malloc((op_count > 0 ? op_count : 1) * sizeof(int));
    if (!parent || !rank || !result) {
        free(parent);
        free(rank);
        free(result);
        *out_size = 0;
        return NULL;
    }

    for (int i = 0; i < n; i++) {
        parent[i] = i;
    }

    int result_count = 0;
    int pos = 1;
    for (int i = 0; i < op_count; i++) {
        int type = arr[pos++];
        int a = arr[pos++];
        int b = arr[pos++];
        if (type == 1) {
            uf_union(parent, rank, a, b);
        } else {
            result[result_count++] = (uf_root(parent, a) == uf_root(parent, b)) ? 1 : 0;
        }
    }

    free(parent);
    free(rank);
    *out_size = result_count;
    return result;
}
