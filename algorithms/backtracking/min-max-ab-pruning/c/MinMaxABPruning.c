#include <stdio.h>
#include <limits.h>
#include <math.h>

static int max(int a, int b) { return a > b ? a : b; }
static int min(int a, int b) { return a < b ? a : b; }

static int minimax_ab_impl(int depth, int nodeIndex, int isMax, int scores[], int h, int alpha, int beta) {
    if (depth == h)
        return scores[nodeIndex];

    if (isMax) {
        int bestVal = INT_MIN;
        int children[] = { nodeIndex * 2, nodeIndex * 2 + 1 };
        for (int i = 0; i < 2; i++) {
            int childValue = minimax_ab_impl(depth + 1, children[i], 0, scores, h, alpha, beta);
            bestVal = max(bestVal, childValue);
            alpha = max(alpha, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    } else {
        int bestVal = INT_MAX;
        int children[] = { nodeIndex * 2, nodeIndex * 2 + 1 };
        for (int i = 0; i < 2; i++) {
            int childValue = minimax_ab_impl(depth + 1, children[i], 1, scores, h, alpha, beta);
            bestVal = min(bestVal, childValue);
            beta = min(beta, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    }
}

static int log2_int(int n) {
    return (n == 1) ? 0 : 1 + log2_int(n / 2);
}

int minimaxAB(int scores[], int depth, int isMax) {
    if (depth < 0) {
        return 0;
    }
    return minimax_ab_impl(0, 0, isMax, scores, depth, INT_MIN, INT_MAX);
}

int minimax_ab(int scores[], int depth, int isMax) {
    return minimaxAB(scores, depth, isMax);
}

int main() {
    int scores[] = {3, 5, 2, 9, 12, 5, 23, 23};
    int n = sizeof(scores) / sizeof(scores[0]);
    int h = log2_int(n);
    int result = minimaxAB(scores, h, 1);
    printf("The optimal value is: %d\n", result);
    return 0;
}
