#include "catalan_numbers.h"

static const long long MOD = 1000000007;

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

static long long mod_inv(long long a, long long mod) {
    return mod_pow(a, mod - 2, mod);
}

int catalan_numbers(int n) {
    long long result = 1;
    for (int i = 1; i <= n; i++) {
        result = result * (2LL * (2 * i - 1)) % MOD;
        result = result * mod_inv(i + 1, MOD) % MOD;
    }
    return (int)result;
}
