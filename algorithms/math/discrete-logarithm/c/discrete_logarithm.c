#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "discrete_logarithm.h"

static long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

int discrete_logarithm(long long base, long long target, long long modulus) {
    if (modulus == 1) return 0;
    int m = (int)ceil(sqrt((double)modulus));
    target %= modulus;

    /* Simple brute force for small moduli */
    long long power = 1;
    for (int j = 0; j < modulus; j++) {
        if (power == target) return j;
        power = power * base % modulus;
    }
    return -1;
}

int main(void) {
    printf("%d\n", discrete_logarithm(2, 8, 13));
    printf("%d\n", discrete_logarithm(5, 1, 7));
    printf("%d\n", discrete_logarithm(3, 3, 11));
    printf("%d\n", discrete_logarithm(3, 13, 17));
    return 0;
}
