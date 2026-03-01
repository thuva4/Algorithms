#include <stdio.h>
#include <stdlib.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void permute(int *arr, int start, int end, int **results, int *count, int n) {
    if (start == end) {
        for (int i = 0; i < n; i++) {
            results[*count][i] = arr[i];
        }
        (*count)++;
        return;
    }
    for (int i = start; i <= end; i++) {
        swap(&arr[start], &arr[i]);
        permute(arr, start + 1, end, results, count, n);
        swap(&arr[start], &arr[i]);
    }
}

int factorial(int n) {
    int result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}

/* Comparison function for qsort to sort permutations lexicographically */
int n_global;
int comparePermutations(const void *a, const void *b) {
    const int *pa = *(const int **)a;
    const int *pb = *(const int **)b;
    for (int i = 0; i < n_global; i++) {
        if (pa[i] != pb[i]) return pa[i] - pb[i];
    }
    return 0;
}

void permutations(int *arr, int n) {
    if (n == 0) {
        printf("[]\n");
        return;
    }
    int total = factorial(n);
    int **results = (int **)malloc(total * sizeof(int *));
    for (int i = 0; i < total; i++) {
        results[i] = (int *)malloc(n * sizeof(int));
    }

    int count = 0;
    permute(arr, 0, n - 1, results, &count, n);

    n_global = n;
    qsort(results, count, sizeof(int *), comparePermutations);

    for (int i = 0; i < count; i++) {
        printf("[");
        for (int j = 0; j < n; j++) {
            printf("%d", results[i][j]);
            if (j < n - 1) printf(", ");
        }
        printf("]\n");
        free(results[i]);
    }
    free(results);
}

int main() {
    int arr[] = {1, 2, 3};
    permutations(arr, 3);
    return 0;
}
