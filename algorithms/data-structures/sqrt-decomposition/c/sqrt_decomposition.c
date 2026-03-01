#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "sqrt_decomposition.h"

SqrtDecomp* sqrt_decomp_build(const int* arr, int n) {
    SqrtDecomp* sd = (SqrtDecomp*)malloc(sizeof(SqrtDecomp));
    sd->n = n;
    sd->block_sz = (int)sqrt(n);
    if (sd->block_sz < 1) sd->block_sz = 1;
    sd->a = (int*)malloc(n * sizeof(int));
    int nb = (n + sd->block_sz - 1) / sd->block_sz;
    sd->blocks = (long long*)calloc(nb, sizeof(long long));
    for (int i = 0; i < n; i++) {
        sd->a[i] = arr[i];
        sd->blocks[i / sd->block_sz] += arr[i];
    }
    return sd;
}

long long sqrt_decomp_query(const SqrtDecomp* sd, int l, int r) {
    long long result = 0;
    int bl = l / sd->block_sz, br = r / sd->block_sz;
    if (bl == br) {
        for (int i = l; i <= r; i++) result += sd->a[i];
    } else {
        for (int i = l; i < (bl + 1) * sd->block_sz; i++) result += sd->a[i];
        for (int b = bl + 1; b < br; b++) result += sd->blocks[b];
        for (int i = br * sd->block_sz; i <= r; i++) result += sd->a[i];
    }
    return result;
}

void sqrt_decomp_free(SqrtDecomp* sd) {
    free(sd->a); free(sd->blocks); free(sd);
}

int* sqrt_decomposition(int arr[], int size, int* out_size) {
    if (size < 1) {
        *out_size = 0;
        return NULL;
    }

    int n = arr[0];
    if (n < 0 || size < 1 + n) {
        *out_size = 0;
        return NULL;
    }

    int remaining = size - 1 - n;
    if (remaining < 0 || (remaining % 2) != 0) {
        *out_size = 0;
        return NULL;
    }

    int q = remaining / 2;
    int* result = (int*)malloc((q > 0 ? q : 1) * sizeof(int));
    if (!result) {
        *out_size = 0;
        return NULL;
    }

    SqrtDecomp* sd = sqrt_decomp_build(arr + 1, n);
    for (int i = 0; i < q; i++) {
        int l = arr[1 + n + (2 * i)];
        int r = arr[1 + n + (2 * i) + 1];
        result[i] = (int)sqrt_decomp_query(sd, l, r);
    }
    sqrt_decomp_free(sd);
    *out_size = q;
    return result;
}

int main(void) {
    int n;
    scanf("%d", &n);
    int* arr = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);
    SqrtDecomp* sd = sqrt_decomp_build(arr, n);
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        int l, r;
        scanf("%d %d", &l, &r);
        if (i) printf(" ");
        printf("%lld", sqrt_decomp_query(sd, l, r));
    }
    printf("\n");
    sqrt_decomp_free(sd);
    free(arr);
    return 0;
}
