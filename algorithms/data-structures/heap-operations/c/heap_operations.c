#include "heap_operations.h"

static void sift_up(int* heap, int i) {
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[i] < heap[parent]) {
            int temp = heap[i]; heap[i] = heap[parent]; heap[parent] = temp;
            i = parent;
        } else break;
    }
}

static void sift_down(int* heap, int i, int size) {
    while (1) {
        int smallest = i;
        int left = 2 * i + 1, right = 2 * i + 2;
        if (left < size && heap[left] < heap[smallest]) smallest = left;
        if (right < size && heap[right] < heap[smallest]) smallest = right;
        if (smallest != i) {
            int temp = heap[i]; heap[i] = heap[smallest]; heap[smallest] = temp;
            i = smallest;
        } else break;
    }
}

void heap_sort_via_extract(const int* arr, int n, int* result, int* result_size) {
    int heap[10000];
    int size = 0;

    for (int i = 0; i < n; i++) {
        heap[size] = arr[i];
        sift_up(heap, size);
        size++;
    }

    *result_size = 0;
    while (size > 0) {
        result[(*result_size)++] = heap[0];
        size--;
        heap[0] = heap[size];
        if (size > 0) sift_down(heap, 0, size);
    }
}
