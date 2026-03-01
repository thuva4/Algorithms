#include "miller_rabin.h"

static long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp % 2 == 1) result = result * base % mod;
        exp /= 2;
        base = base * base % mod;
    }
    return result;
}

int miller_rabin(int n) {
    if (n < 2) return 0;
    if (n < 4) return 1;
    if (n % 2 == 0) return 0;

    int r = 0;
    long long d = n - 1;
    while (d % 2 == 0) { r++; d /= 2; }

    int witnesses[] = {2, 3, 5, 7};
    int nw = 4;

    for (int w = 0; w < nw; w++) {
        int a = witnesses[w];
        if (a >= n) continue;

        long long x = mod_pow(a, d, n);
        if (x == 1 || x == n - 1) continue;

        int found = 0;
        for (int i = 0; i < r - 1; i++) {
            x = mod_pow(x, 2, n);
            if (x == n - 1) { found = 1; break; }
        }

        if (!found) return 0;
    }

    return 1;
}
