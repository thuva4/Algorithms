#include "bucket_sort.h"
#include <stdlib.h>
#include <string.h>

typedef struct {
    int *data;
    int size;
    int capacity;
} Bucket;

static void bucket_add(Bucket *b, int x) {
    if (b->size == b->capacity) {
        b->capacity = b->capacity == 0 ? 4 : b->capacity * 2;
        b->data = (int *)realloc(b->data, b->capacity * sizeof(int));
    }
    b->data[b->size++] = x;
}

static void insertion_sort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

/**
 * Bucket Sort implementation.
 * Divides the input into several buckets, each of which is then sorted individually.
 * @param arr the input array (modified in-place)
 * @param n the number of elements in the array
 */
void bucket_sort(int arr[], int n) {
    if (n <= 1) return;

    int min_val = arr[0], max_val = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < min_val) min_val = arr[i];
        if (arr[i] > max_val) max_val = arr[i];
    }

    if (min_val == max_val) return;

    Bucket *buckets = (Bucket *)calloc(n, sizeof(Bucket));
    long long range = (long long)max_val - min_val;

    for (int i = 0; i < n; i++) {
        int idx = (int)((long long)(arr[i] - min_val) * (n - 1) / range);
        bucket_add(&buckets[idx], arr[i]);
    }

    int k = 0;
    for (int i = 0; i < n; i++) {
        if (buckets[i].size > 0) {
            insertion_sort(buckets[i].data, buckets[i].size);
            for (int j = 0; j < buckets[i].size; j++) {
                arr[k++] = buckets[i].data[j];
            }
            free(buckets[i].data);
        }
    }
    free(buckets);
}
