#include "queue_operations.h"

int queue_ops(const int* arr, int n) {
    if (n == 0) return 0;
    int queue[10000];
    int front = 0, rear = 0;
    int op_count = arr[0], idx = 1, total = 0;
    for (int i = 0; i < op_count; i++) {
        int type = arr[idx], val = arr[idx + 1]; idx += 2;
        if (type == 1) queue[rear++] = val;
        else if (type == 2 && front < rear) total += queue[front++];
    }
    return total;
}
