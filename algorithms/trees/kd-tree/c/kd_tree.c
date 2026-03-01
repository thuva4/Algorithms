#include <stdio.h>
#include <limits.h>
#include "kd_tree.h"

int kd_tree(const int *data, int data_len) {
    int n = data[0];
    int idx = 1;
    int qx = data[1 + 2 * n], qy = data[2 + 2 * n];
    int best = INT_MAX;
    for (int i = 0; i < n; i++) {
        int dx = data[idx] - qx;
        int dy = data[idx + 1] - qy;
        int d = dx * dx + dy * dy;
        if (d < best) best = d;
        idx += 2;
    }
    return best;
}

int main(void) {
    int d1[] = {3, 1, 2, 3, 4, 5, 6, 3, 3};
    printf("%d\n", kd_tree(d1, 9));
    int d2[] = {2, 0, 0, 5, 5, 0, 0};
    printf("%d\n", kd_tree(d2, 7));
    int d3[] = {1, 3, 4, 0, 0};
    printf("%d\n", kd_tree(d3, 5));
    return 0;
}
