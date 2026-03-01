#include <iostream>
#include <algorithm>
#include <climits>
#include <cmath>
#include <vector>
using namespace std;

int minimaxAB(int depth, int nodeIndex, bool isMax, int scores[], int h, int alpha, int beta) {
    if (depth == h)
        return scores[nodeIndex];

    if (isMax) {
        int bestVal = INT_MIN;
        for (int childIndex : {nodeIndex * 2, nodeIndex * 2 + 1}) {
            int childValue = minimaxAB(depth + 1, childIndex, false, scores, h, alpha, beta);
            bestVal = max(bestVal, childValue);
            alpha = max(alpha, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    } else {
        int bestVal = INT_MAX;
        for (int childIndex : {nodeIndex * 2, nodeIndex * 2 + 1}) {
            int childValue = minimaxAB(depth + 1, childIndex, true, scores, h, alpha, beta);
            bestVal = min(bestVal, childValue);
            beta = min(beta, bestVal);
            if (beta <= alpha) break;
        }
        return bestVal;
    }
}

int minimax_ab(const vector<int>& tree_values, int depth, bool is_maximizing) {
    if (tree_values.empty()) {
        return 0;
    }
    if (depth <= 0 || tree_values.size() == 1) {
        return tree_values.front();
    }

    vector<int> values = tree_values;
    int padded_size = 1;
    while (padded_size < static_cast<int>(values.size())) {
        padded_size <<= 1;
    }
    values.resize(padded_size, values.back());

    return minimaxAB(0, 0, is_maximizing, values.data(), depth, INT_MIN, INT_MAX);
}

int main() {
    int scores[] = {3, 5, 2, 9, 12, 5, 23, 23};
    int n = sizeof(scores) / sizeof(scores[0]);
    int h = (int)(log2(n));
    int result = minimaxAB(0, 0, true, scores, h, INT_MIN, INT_MAX);
    cout << "The optimal value is: " << result << endl;
    return 0;
}
