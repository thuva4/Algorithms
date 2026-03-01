#include <stdio.h>
#include <stdlib.h>
#include "levenshtein_distance.h"

/**
 * Compute the Levenshtein (edit) distance between two sequences.
 *
 * Input format: [len1, seq1..., len2, seq2...]
 * Returns: minimum number of single-element edits
 */
int levenshtein_distance(int* arr, int size) {
    int idx = 0;
    int len1 = arr[idx++];
    int* seq1 = arr + idx;
    idx += len1;
    int len2 = arr[idx++];
    int* seq2 = arr + idx;

    int i, j;
    int** dp = (int**)malloc((len1 + 1) * sizeof(int*));
    for (i = 0; i <= len1; i++) {
        dp[i] = (int*)malloc((len2 + 1) * sizeof(int));
    }

    for (i = 0; i <= len1; i++) dp[i][0] = i;
    for (j = 0; j <= len2; j++) dp[0][j] = j;

    for (i = 1; i <= len1; i++) {
        for (j = 1; j <= len2; j++) {
            if (seq1[i - 1] == seq2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                int del = dp[i - 1][j];
                int ins = dp[i][j - 1];
                int sub = dp[i - 1][j - 1];
                int min = del;
                if (ins < min) min = ins;
                if (sub < min) min = sub;
                dp[i][j] = 1 + min;
            }
        }
    }

    int result = dp[len1][len2];

    for (i = 0; i <= len1; i++) free(dp[i]);
    free(dp);

    return result;
}

int main() {
    int a1[] = {3, 1, 2, 3, 3, 1, 2, 4};
    printf("%d\n", levenshtein_distance(a1, 8)); /* 1 */

    int a2[] = {2, 5, 6, 2, 5, 6};
    printf("%d\n", levenshtein_distance(a2, 6)); /* 0 */

    int a3[] = {2, 1, 2, 2, 3, 4};
    printf("%d\n", levenshtein_distance(a3, 6)); /* 2 */

    int a4[] = {0, 3, 1, 2, 3};
    printf("%d\n", levenshtein_distance(a4, 5)); /* 3 */

    return 0;
}
