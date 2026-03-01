#include "detect_cycle.h"

static int next_pos(int arr[], int size, int pos) {
    if (pos < 0 || pos >= size || arr[pos] == -1) {
        return -1;
    }
    return arr[pos];
}

int detect_cycle(int arr[], int size) {
    if (size == 0) {
        return -1;
    }

    int tortoise = 0;
    int hare = 0;

    /* Phase 1: Detect cycle */
    while (1) {
        tortoise = next_pos(arr, size, tortoise);
        if (tortoise == -1) return -1;

        hare = next_pos(arr, size, hare);
        if (hare == -1) return -1;
        hare = next_pos(arr, size, hare);
        if (hare == -1) return -1;

        if (tortoise == hare) break;
    }

    /* Phase 2: Find cycle start */
    int pointer1 = 0;
    int pointer2 = tortoise;
    while (pointer1 != pointer2) {
        pointer1 = arr[pointer1];
        pointer2 = arr[pointer2];
    }

    return pointer1;
}
