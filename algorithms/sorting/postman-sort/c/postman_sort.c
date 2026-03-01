#include "postman_sort.h"
#include <stdlib.h>
#include <stdio.h>

static int get_max(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max)
            max = arr[i];
    }
    return max;
}

static int get_min(int arr[], int n) {
    int min = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < min)
            min = arr[i];
    }
    return min;
}

static void count_sort(int arr[], int n, int exp) {
    int* output = (int*)malloc(n * sizeof(int));
    if (output == NULL) return; // Allocation failed
    
    int count[10] = {0};
    int i;

    for (i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    for (i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for (i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (i = 0; i < n; i++)
        arr[i] = output[i];
        
    free(output);
}

void postman_sort(int arr[], int n) {
    if (n <= 0) return;

    int min_val = get_min(arr, n);
    int offset = 0;
    
    if (min_val < 0) {
        offset = -min_val;
        for (int i = 0; i < n; i++) {
            arr[i] += offset;
        }
    }
    
    int max_val = get_max(arr, n);
    
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        count_sort(arr, n, exp);
    }
    
    if (offset > 0) {
        for (int i = 0; i < n; i++) {
            arr[i] -= offset;
        }
    }
}
