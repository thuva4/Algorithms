#include "huffman_coding.h"
#include <stdlib.h>

static void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

static void sift_up(int heap[], int index) {
    while (index > 0) {
        int parent = (index - 1) / 2;
        if (heap[index] < heap[parent]) {
            swap(&heap[index], &heap[parent]);
            index = parent;
        } else {
            break;
        }
    }
}

static void sift_down(int heap[], int size, int index) {
    while (2 * index + 1 < size) {
        int smallest = index;
        int left = 2 * index + 1;
        int right = 2 * index + 2;

        if (left < size && heap[left] < heap[smallest]) {
            smallest = left;
        }
        if (right < size && heap[right] < heap[smallest]) {
            smallest = right;
        }
        if (smallest == index) {
            break;
        }
        swap(&heap[index], &heap[smallest]);
        index = smallest;
    }
}

int huffman_coding(int frequencies[], int size) {
    if (size <= 1) {
        return 0;
    }

    int *heap = (int *)malloc(size * sizeof(int));
    int heap_size = 0;

    for (int i = 0; i < size; i++) {
        heap[heap_size] = frequencies[i];
        sift_up(heap, heap_size);
        heap_size++;
    }

    int total_cost = 0;
    while (heap_size > 1) {
        int left = heap[0];
        heap[0] = heap[--heap_size];
        sift_down(heap, heap_size, 0);

        int right = heap[0];
        heap[0] = heap[--heap_size];
        sift_down(heap, heap_size, 0);

        int merged = left + right;
        total_cost += merged;

        heap[heap_size] = merged;
        sift_up(heap, heap_size);
        heap_size++;
    }

    free(heap);
    return total_cost;
}
