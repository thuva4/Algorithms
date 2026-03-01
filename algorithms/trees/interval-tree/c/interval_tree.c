#include <stdio.h>
#include "interval_tree.h"

int interval_tree(const int *data, int data_len) {
    int n = data[0];
    int query = data[2 * n + 1];
    int count = 0;
    int idx = 1;
    for (int i = 0; i < n; i++) {
        int lo = data[idx], hi = data[idx + 1];
        idx += 2;
        if (lo <= query && query <= hi) count++;
    }
    return count;
}

int main(void) {
    int d1[] = {3, 1, 5, 3, 8, 6, 10, 4};
    printf("%d\n", interval_tree(d1, 8));
    int d2[] = {2, 1, 3, 5, 7, 10};
    printf("%d\n", interval_tree(d2, 6));
    int d3[] = {3, 1, 10, 2, 9, 3, 8, 5};
    printf("%d\n", interval_tree(d3, 8));
    return 0;
}
