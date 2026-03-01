#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Compute the Levenshtein (edit) distance between two sequences.
 *
 * Input format: [len1, seq1..., len2, seq2...]
 * Returns: minimum number of single-element edits
 */
int levenshteinDistance(const vector<int>& arr) {
    int idx = 0;
    int len1 = arr[idx++];
    vector<int> seq1(arr.begin() + idx, arr.begin() + idx + len1);
    idx += len1;
    int len2 = arr[idx++];
    vector<int> seq2(arr.begin() + idx, arr.begin() + idx + len2);

    vector<vector<int>> dp(len1 + 1, vector<int>(len2 + 1, 0));

    for (int i = 0; i <= len1; i++) dp[i][0] = i;
    for (int j = 0; j <= len2; j++) dp[0][j] = j;

    for (int i = 1; i <= len1; i++) {
        for (int j = 1; j <= len2; j++) {
            if (seq1[i - 1] == seq2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
            }
        }
    }

    return dp[len1][len2];
}

int main() {
    cout << levenshteinDistance({3, 1, 2, 3, 3, 1, 2, 4}) << endl; // 1
    cout << levenshteinDistance({2, 5, 6, 2, 5, 6}) << endl;       // 0
    cout << levenshteinDistance({2, 1, 2, 2, 3, 4}) << endl;       // 2
    cout << levenshteinDistance({0, 3, 1, 2, 3}) << endl;          // 3
    return 0;
}
