#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "matrix_determinant.h"

int matrix_determinant(int* arr, int size) {
    int idx = 0, n = arr[idx++], i, j, col, row;
    double** mat = (double**)malloc(n * sizeof(double*));
    for (i = 0; i < n; i++) { mat[i] = (double*)malloc(n * sizeof(double)); for (j = 0; j < n; j++) mat[i][j] = arr[idx++]; }

    double det = 1.0;
    for (col = 0; col < n; col++) {
        int maxRow = col;
        for (row = col+1; row < n; row++) if (fabs(mat[row][col]) > fabs(mat[maxRow][col])) maxRow = row;
        if (maxRow != col) { double* t = mat[col]; mat[col] = mat[maxRow]; mat[maxRow] = t; det *= -1; }
        if (mat[col][col] == 0) { for (i = 0; i < n; i++) free(mat[i]); free(mat); return 0; }
        det *= mat[col][col];
        for (row = col+1; row < n; row++) {
            double f = mat[row][col] / mat[col][col];
            for (j = col+1; j < n; j++) mat[row][j] -= f * mat[col][j];
        }
    }

    int result = (int)round(det);
    for (i = 0; i < n; i++) free(mat[i]);
    free(mat);
    return result;
}

int main() {
    int a1[] = {2, 1, 2, 3, 4}; printf("%d\n", matrix_determinant(a1, 5));
    int a2[] = {2, 1, 0, 0, 1}; printf("%d\n", matrix_determinant(a2, 5));
    int a3[] = {3, 6, 1, 1, 4, -2, 5, 2, 8, 7}; printf("%d\n", matrix_determinant(a3, 10));
    int a4[] = {1, 5}; printf("%d\n", matrix_determinant(a4, 2));
    return 0;
}
