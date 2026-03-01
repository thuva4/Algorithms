#include <stdio.h>
#include "rsa_algorithm.h"

static long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

static long long ext_gcd(long long a, long long b, long long *x, long long *y) {
    if (a == 0) { *x = 0; *y = 1; return b; }
    long long x1, y1;
    long long g = ext_gcd(b % a, a, &x1, &y1);
    *x = y1 - (b / a) * x1;
    *y = x1;
    return g;
}

static long long mod_inv(long long e, long long phi) {
    long long x, y;
    ext_gcd(e, phi, &x, &y);
    return (x % phi + phi) % phi;
}

long long rsa_algorithm(long long p, long long q, long long e, long long message) {
    long long n = p * q;
    long long phi = (p - 1) * (q - 1);
    long long d = mod_inv(e, phi);
    long long cipher = mod_pow(message, e, n);
    return mod_pow(cipher, d, n);
}

int main(void) {
    printf("%lld\n", rsa_algorithm(61, 53, 17, 65));
    printf("%lld\n", rsa_algorithm(61, 53, 17, 42));
    printf("%lld\n", rsa_algorithm(11, 13, 7, 9));
    return 0;
}
