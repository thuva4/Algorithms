#include <stdio.h>
#include <stdlib.h>
#include "palindrome_partitioning.h"

int palindrome_partitioning(int* arr, int n) {
    if (n <= 1) return 0;
    int i, j, len;

    int** isPal = (int**)malloc(n * sizeof(int*));
    for (i = 0; i < n; i++) {
        isPal[i] = (int*)calloc(n, sizeof(int));
        isPal[i][i] = 1;
    }
    for (i = 0; i < n - 1; i++) isPal[i][i+1] = (arr[i] == arr[i+1]);
    for (len = 3; len <= n; len++)
        for (i = 0; i <= n - len; i++) {
            j = i + len - 1;
            isPal[i][j] = (arr[i] == arr[j]) && isPal[i+1][j-1];
        }

    int* cuts = (int*)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) {
        if (isPal[0][i]) { cuts[i] = 0; continue; }
        cuts[i] = i;
        for (j = 1; j <= i; j++)
            if (isPal[j][i] && cuts[j-1] + 1 < cuts[i])
                cuts[i] = cuts[j-1] + 1;
    }

    int result = cuts[n-1];
    for (i = 0; i < n; i++) free(isPal[i]);
    free(isPal); free(cuts);
    return result;
}

int main() {
    int a1[] = {1, 2, 1}; printf("%d\n", palindrome_partitioning(a1, 3));
    int a2[] = {1, 2, 3, 2}; printf("%d\n", palindrome_partitioning(a2, 4));
    int a3[] = {1, 2, 3}; printf("%d\n", palindrome_partitioning(a3, 3));
    int a4[] = {5}; printf("%d\n", palindrome_partitioning(a4, 1));
    return 0;
}
