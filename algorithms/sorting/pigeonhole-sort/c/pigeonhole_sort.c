#include "pigeonhole_sort.h"
#include <stdlib.h>
#include <string.h>

void pigeonhole_sort(int arr[], int n) {
    if (n <= 0) return;

    int min_val = arr[0];
    int max_val = arr[0];

    for (int i = 1; i < n; i++) {
        if (arr[i] < min_val) min_val = arr[i];
        if (arr[i] > max_val) max_val = arr[i];
    }

    int range = max_val - min_val + 1;
    int *holes = (int *)calloc(range, sizeof(int));
    if (!holes) return;

    for (int i = 0; i < n; i++) {
        holes[arr[i] - min_val]++;
    }

    int index = 0;
    for (int i = 0; i < range; i++) {
        while (holes[i] > 0) {
            arr[index++] = i + min_val;
            holes[i]--;
        }
    }

    free(holes);
}
