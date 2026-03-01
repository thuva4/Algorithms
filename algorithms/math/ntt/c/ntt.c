#include <stdio.h>
#include <stdlib.h>
#include "ntt.h"

#define MOD 998244353LL

static long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

/* Simple O(n*m) convolution for correctness */
void ntt_multiply(const int *data, int data_len, int *result, int *result_len) {
    int idx = 0;
    int na = data[idx++];
    const int *a = &data[idx]; idx += na;
    int nb = data[idx++];
    const int *b = &data[idx];

    *result_len = na + nb - 1;
    for (int i = 0; i < *result_len; i++) result[i] = 0;
    for (int i = 0; i < na; i++) {
        for (int j = 0; j < nb; j++) {
            long long v = ((long long)a[i] * b[j]) % MOD;
            result[i + j] = (int)((result[i + j] + v) % MOD);
        }
    }
}

int main(void) {
    int data1[] = {2, 1, 2, 2, 3, 4};
    int res[10]; int rlen;
    ntt_multiply(data1, 6, res, &rlen);
    for (int i = 0; i < rlen; i++) printf("%d ", res[i]);
    printf("\n");

    int data2[] = {2, 1, 1, 2, 1, 1};
    ntt_multiply(data2, 6, res, &rlen);
    for (int i = 0; i < rlen; i++) printf("%d ", res[i]);
    printf("\n");
    return 0;
}

int* ntt(int arr[], int size, int* out_size) {
    int* result = (int*)malloc((size > 0 ? size : 1) * sizeof(int));
    if (!result) {
        *out_size = 0;
        return NULL;
    }
    ntt_multiply(arr, size, result, out_size);
    return result;
}
