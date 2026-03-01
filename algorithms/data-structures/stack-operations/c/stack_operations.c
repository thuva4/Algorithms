#include "stack_operations.h"

int stack_ops(const int* arr, int n) {
    if (n == 0) return 0;
    int stack[10000];
    int top = -1;
    int op_count = arr[0], idx = 1, total = 0;
    for (int i = 0; i < op_count; i++) {
        int type = arr[idx], val = arr[idx + 1];
        idx += 2;
        if (type == 1) stack[++top] = val;
        else if (type == 2) {
            if (top >= 0) total += stack[top--];
            else total += -1;
        }
    }
    return total;
}
