#include <stdio.h>

/* Modular exponentiation: (base^exp) % mod */
long long mod_pow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1)
            result = (result * base) % mod;
        exp >>= 1;
        base = (base * base) % mod;
    }
    return result;
}

int main() {
    long long p = 23;   /* publicly shared prime */
    long long g = 5;    /* publicly shared base (generator) */

    long long a = 6;    /* Alice's secret */
    long long b = 15;   /* Bob's secret */

    /* Alice sends A = g^a mod p */
    long long A = mod_pow(g, a, p);
    printf("Alice sends: %lld\n", A);

    /* Bob sends B = g^b mod p */
    long long B = mod_pow(g, b, p);
    printf("Bob sends: %lld\n", B);

    /* Alice computes shared secret: s = B^a mod p */
    long long alice_secret = mod_pow(B, a, p);
    printf("Alice's shared secret: %lld\n", alice_secret);

    /* Bob computes shared secret: s = A^b mod p */
    long long bob_secret = mod_pow(A, b, p);
    printf("Bob's shared secret: %lld\n", bob_secret);

    return 0;
}
