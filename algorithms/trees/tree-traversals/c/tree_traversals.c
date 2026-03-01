#include "tree_traversals.h"
#include <stdlib.h>

static void inorder(int* arr, int n, int i, int* result, int* idx) {
    if (i >= n || arr[i] == -1) return;
    inorder(arr, n, 2 * i + 1, result, idx);
    result[(*idx)++] = arr[i];
    inorder(arr, n, 2 * i + 2, result, idx);
}

int* tree_traversals(int* arr, int n, int* out_size) {
    int* result = (int*)malloc(n * sizeof(int));
    int idx = 0;
    inorder(arr, n, 0, result, &idx);
    *out_size = idx;
    return result;
}
