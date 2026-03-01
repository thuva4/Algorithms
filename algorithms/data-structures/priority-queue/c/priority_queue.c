#include "priority_queue.h"

int priority_queue_ops(const int* arr, int n) {
    if (n == 0) return 0;

    int heap[10000];
    int size = 0;
    int op_count = arr[0];
    int idx = 1;
    int total = 0;

    for (int i = 0; i < op_count; i++) {
        int type = arr[idx];
        int val = arr[idx + 1];
        idx += 2;
        if (type == 1) {
            heap[size] = val;
            int j = size;
            size++;
            while (j > 0) {
                int p = (j - 1) / 2;
                if (heap[j] < heap[p]) {
                    int tmp = heap[j]; heap[j] = heap[p]; heap[p] = tmp;
                    j = p;
                } else break;
            }
        } else if (type == 2) {
            if (size == 0) continue;
            total += heap[0];
            size--;
            heap[0] = heap[size];
            int j = 0;
            while (1) {
                int s = j, l = 2*j+1, r = 2*j+2;
                if (l < size && heap[l] < heap[s]) s = l;
                if (r < size && heap[r] < heap[s]) s = r;
                if (s != j) {
                    int tmp = heap[j]; heap[j] = heap[s]; heap[s] = tmp;
                    j = s;
                } else break;
            }
        }
    }
    return total;
}
