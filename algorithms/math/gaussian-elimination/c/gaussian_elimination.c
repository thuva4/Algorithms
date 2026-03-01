#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "gaussian_elimination.h"

int gaussian_elimination(int* arr, int size) {
    int idx = 0, n = arr[idx++], i, j, col, row;
    double** mat = (double**)malloc(n * sizeof(double*));
    for (i = 0; i < n; i++) {
        mat[i] = (double*)malloc((n+1) * sizeof(double));
        for (j = 0; j <= n; j++) mat[i][j] = arr[idx++];
    }

    for (col = 0; col < n; col++) {
        int maxRow = col;
        for (row = col+1; row < n; row++)
            if (fabs(mat[row][col]) > fabs(mat[maxRow][col])) maxRow = row;
        double* tmp = mat[col]; mat[col] = mat[maxRow]; mat[maxRow] = tmp;
        for (row = col+1; row < n; row++) {
            if (mat[col][col] == 0) continue;
            double f = mat[row][col] / mat[col][col];
            for (j = col; j <= n; j++) mat[row][j] -= f * mat[col][j];
        }
    }

    double* sol = (double*)malloc(n * sizeof(double));
    for (i = n-1; i >= 0; i--) {
        sol[i] = mat[i][n];
        for (j = i+1; j < n; j++) sol[i] -= mat[i][j] * sol[j];
        sol[i] /= mat[i][i];
    }

    double sum = 0; for (i = 0; i < n; i++) sum += sol[i];
    int result = (int)round(sum);
    for (i = 0; i < n; i++) free(mat[i]);
    free(mat); free(sol);
    return result;
}

int main() {
    int a1[] = {2, 1, 1, 3, 2, 1, 4}; printf("%d\n", gaussian_elimination(a1, 7));
    int a2[] = {2, 1, 0, 5, 0, 1, 3}; printf("%d\n", gaussian_elimination(a2, 7));
    int a3[] = {1, 2, 6}; printf("%d\n", gaussian_elimination(a3, 3));
    int a4[] = {3, 1, 1, 1, 6, 0, 2, 1, 5, 0, 0, 3, 9}; printf("%d\n", gaussian_elimination(a4, 13));
    return 0;
}
