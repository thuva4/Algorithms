#include <stdio.h>
#include <string.h>

#define MAX_N 100001

int tree[MAX_N];
int n;

void update(int i, int delta) {
    for (++i; i <= n; i += i & (-i))
        tree[i] += delta;
}

int query(int i) {
    int sum = 0;
    for (++i; i > 0; i -= i & (-i))
        sum += tree[i];
    return sum;
}

void build(int arr[], int size) {
    n = size;
    memset(tree, 0, sizeof(tree));
    for (int i = 0; i < n; i++)
        update(i, arr[i]);
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    build(arr, 5);
    printf("Sum of first 4 elements: %d\n", query(3));

    update(2, 5);
    printf("After update, sum of first 4 elements: %d\n", query(3));
    return 0;
}

int* fenwick_tree_operations(int arr[], int size, int* out_size) {
    if (size < 1) {
        *out_size = 0;
        return NULL;
    }

    int len = arr[0];
    if (len < 0 || size < 1 + len) {
        *out_size = 0;
        return NULL;
    }

    int remaining = size - 1 - len;
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

    int* values = (int*)malloc((len > 0 ? len : 1) * sizeof(int));
    if (!values) {
        free(result);
        *out_size = 0;
        return NULL;
    }

    for (int i = 0; i < len; i++) {
        values[i] = arr[1 + i];
    }
    build(values, len);
    int pos = 1 + len;
    int result_count = 0;
    for (int i = 0; i < q; i++) {
        int type = arr[pos++];
        int a = arr[pos++];
        int b = arr[pos++];
        if (type == 1) {
            int delta = b - values[a];
            values[a] = b;
            update(a, delta);
        } else {
            result[result_count++] = query(a);
        }
    }

    free(values);
    *out_size = result_count;
    return result;
}
