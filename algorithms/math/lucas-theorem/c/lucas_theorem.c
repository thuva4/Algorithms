#include <stdio.h>
#include <stdlib.h>
#include "lucas_theorem.h"

static long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

int lucas_theorem(long long n, long long k, int p) {
    if (k > n) return 0;
    long long *fact = (long long *)malloc(p * sizeof(long long));
    fact[0] = 1;
    for (int i = 1; i < p; i++) fact[i] = fact[i - 1] * i % p;

    long long result = 1;
    while (n > 0 || k > 0) {
        int ni = (int)(n % p), ki = (int)(k % p);
        if (ki > ni) { free(fact); return 0; }
        long long c = fact[ni] * mod_pow(fact[ki], p - 2, p) % p;
        c = c * mod_pow(fact[ni - ki], p - 2, p) % p;
        result = result * c % p;
        n /= p; k /= p;
    }
    free(fact);
    return (int)result;
}

int main(void) {
    printf("%d\n", lucas_theorem(10, 3, 7));
    printf("%d\n", lucas_theorem(5, 2, 3));
    printf("%d\n", lucas_theorem(100, 50, 13));
    return 0;
}
