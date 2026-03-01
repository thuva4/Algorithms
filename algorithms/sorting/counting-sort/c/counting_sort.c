#include "counting_sort.h"
#include <stdlib.h>
#include <string.h>

void counting_sort(int arr[], int n) {
    if (n <= 1) return;

    int min_val = arr[0];
    int max_val = arr[0];

    for (int i = 1; i < n; i++) {
        if (arr[i] < min_val) min_val = arr[i];
        if (arr[i] > max_val) max_val = arr[i];
    }

    int range = max_val - min_val + 1;
    int *count = (int *)calloc(range, sizeof(int));
    int *output = (int *)malloc(n * sizeof(int));

    if (!count || !output) {
        free(count);
        free(output);
        return;
    }

    for (int i = 0; i < n; i++) {
        count[arr[i] - min_val]++;
    }

    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    for (int i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min_val] - 1] = arr[i];
        count[arr[i] - min_val]--;
    }

    memcpy(arr, output, n * sizeof(int));

    free(count);
    free(output);
}
