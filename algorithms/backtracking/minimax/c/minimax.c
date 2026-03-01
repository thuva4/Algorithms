#include <stdio.h>
#include <math.h>

static int max(int a, int b) { return a > b ? a : b; }
static int min(int a, int b) { return a < b ? a : b; }

static int minimax_impl(int depth, int nodeIndex, int isMax, int scores[], int h) {
    if (depth == h)
        return scores[nodeIndex];

    if (isMax)
        return max(minimax_impl(depth + 1, nodeIndex * 2, 0, scores, h),
                   minimax_impl(depth + 1, nodeIndex * 2 + 1, 0, scores, h));
    else
        return min(minimax_impl(depth + 1, nodeIndex * 2, 1, scores, h),
                   minimax_impl(depth + 1, nodeIndex * 2 + 1, 1, scores, h));
}

static int log2_int(int n) {
    return (n == 1) ? 0 : 1 + log2_int(n / 2);
}

int minimax(int scores[], int depth, int isMax) {
    if (depth < 0) {
        return 0;
    }
    return minimax_impl(0, 0, isMax, scores, depth);
}

int main() {
    int scores[] = {3, 5, 2, 9, 12, 5, 23, 23};
    int n = sizeof(scores) / sizeof(scores[0]);
    int h = log2_int(n);
    int result = minimax(scores, h, 1);
    printf("The optimal value is: %d\n", result);
    return 0;
}
