#include <stdio.h>
#include <stdlib.h>
#include <math.h>

int *tree;
int n;

void build(int arr[], int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
    } else {
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);
        build(arr, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
}

void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
    } else {
        int mid = (start + end) / 2;
        if (idx <= mid)
            update(2 * node + 1, start, mid, idx, val);
        else
            update(2 * node + 2, mid + 1, end, idx, val);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
}

int query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return tree[node];
    int mid = (start + end) / 2;
    return query(2 * node + 1, start, mid, l, r) +
           query(2 * node + 2, mid + 1, end, l, r);
}

int main() {
    int arr[] = {1, 3, 5, 7, 9, 11};
    n = sizeof(arr) / sizeof(arr[0]);
    int size = 4 * n;
    tree = (int *)calloc(size, sizeof(int));

    build(arr, 0, 0, n - 1);
    printf("Sum [1, 3]: %d\n", query(0, 0, n - 1, 1, 3));

    update(0, 0, n - 1, 1, 10);
    printf("After update, sum [1, 3]: %d\n", query(0, 0, n - 1, 1, 3));

    free(tree);
    return 0;
}

int* segment_tree_operations(int arr[], int size, int* out_size) {
    if (size < 1) {
        *out_size = 0;
        return NULL;
    }

    n = arr[0];
    if (n < 0 || size < 1 + n) {
        *out_size = 0;
        return NULL;
    }

    int remaining = size - 1 - n;
    if (remaining < 0 || (remaining % 3) != 0) {
        *out_size = 0;
        return NULL;
    }

    int q = remaining / 3;
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    if (!result) {
        *out_size = 0;
        return NULL;
    }

    tree = (int *)calloc(4 * (n > 0 ? n : 1), sizeof(int));
    if (!tree) {
        free(result);
        *out_size = 0;
        return NULL;
    }

    build(arr + 1, 0, 0, n - 1);
    int pos = 1 + n;
    int result_count = 0;
    for (int i = 0; i < q; i++) {
        int type = arr[pos++];
        int a = arr[pos++];
        int b = arr[pos++];
        if (type == 1) {
            update(0, 0, n - 1, a, b);
        } else {
            result[result_count++] = query(0, 0, n - 1, a, b);
        }
    }

    free(tree);
    *out_size = result_count;
    return result;
}
