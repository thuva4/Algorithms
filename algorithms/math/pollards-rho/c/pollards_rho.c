#include <stdio.h>
#include <stdlib.h>
#include "pollards_rho.h"

static long long gcd_ll(long long a, long long b) {
    if (a < 0) a = -a;
    while (b) { long long t = b; b = a % b; a = t; }
    return a;
}

static int is_prime(long long n) {
    if (n < 2) return 0;
    if (n < 4) return 1;
    if (n % 2 == 0 || n % 3 == 0) return 0;
    for (long long i = 5; i * i <= n; i += 6)
        if (n % i == 0 || n % (i + 2) == 0) return 0;
    return 1;
}

static long long rho(long long n) {
    if (n % 2 == 0) return 2;
    long long x = 2, y = 2, c = 1, d = 1;
    while (d == 1) {
        x = ((__int128)x * x + c) % n;
        y = ((__int128)y * y + c) % n;
        y = ((__int128)y * y + c) % n;
        d = gcd_ll(x > y ? x - y : y - x, n);
    }
    return d != n ? d : n;
}

long long pollards_rho(long long n) {
    if (n <= 1) return n;
    if (is_prime(n)) return n;

    /* Find smallest prime factor by trial for small factors first */
    for (long long p = 2; p * p <= n && p < 1000; p++) {
        if (n % p == 0) return p;
    }

    long long smallest = n;
    long long stack[64];
    int top = 0;
    stack[top++] = n;
    while (top > 0) {
        long long num = stack[--top];
        if (num <= 1) continue;
        if (is_prime(num)) {
            if (num < smallest) smallest = num;
            continue;
        }
        long long d = rho(num);
        stack[top++] = d;
        stack[top++] = num / d;
    }
    return smallest;
}

int main(void) {
    printf("%lld\n", pollards_rho(15));
    printf("%lld\n", pollards_rho(13));
    printf("%lld\n", pollards_rho(91));
    printf("%lld\n", pollards_rho(221));
    return 0;
}
