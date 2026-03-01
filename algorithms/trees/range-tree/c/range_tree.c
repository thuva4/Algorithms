#include <stdio.h>
#include <stdlib.h>
#include "range_tree.h"

static int cmp(const void *a, const void *b) {
    return (*(int *)a) - (*(int *)b);
}

int range_tree(const int *data, int data_len) {
    int n = data[0];
    int *points = (int *)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) points[i] = data[1 + i];
    qsort(points, n, sizeof(int), cmp);

    int lo = data[1 + n], hi = data[2 + n];
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (points[i] >= lo && points[i] <= hi) count++;
    }
    free(points);
    return count;
}

int main(void) {
    int d1[] = {5, 1, 3, 5, 7, 9, 2, 6};
    printf("%d\n", range_tree(d1, 8));
    int d2[] = {4, 2, 4, 6, 8, 1, 10};
    printf("%d\n", range_tree(d2, 7));
    return 0;
}
