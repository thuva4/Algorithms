#include "run_length_encoding.h"
#include <stdlib.h>

int* run_length_encoding(int* arr, int n, int* out_size) {
    if (n == 0) { *out_size = 0; return NULL; }
    int* result = (int*)malloc(2 * n * sizeof(int));
    int idx = 0, count = 1;
    for (int i = 1; i < n; i++) {
        if (arr[i] == arr[i-1]) { count++; }
        else { result[idx++] = arr[i-1]; result[idx++] = count; count = 1; }
    }
    result[idx++] = arr[n-1]; result[idx++] = count;
    *out_size = idx;
    return result;
}
