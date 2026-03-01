#include <stdio.h>
#include "robin_karp_rolling_hash.h"

#define BASE 31LL
#define MOD 1000000007LL

static long long modpow(long long base, long long exp, long long mod) {
    long long r = 1; base %= mod;
    while (exp > 0) { if (exp & 1) r = r * base % mod; exp >>= 1; base = base * base % mod; }
    return r;
}

int robin_karp_rolling_hash(int* arr, int size) {
    int idx = 0;
    int tlen = arr[idx++];
    int* text = arr + idx; idx += tlen;
    int plen = arr[idx++];
    int* pattern = arr + idx;
    if (plen > tlen) return -1;

    long long pHash = 0, tHash = 0, power = 1;
    int i, j;
    for (i = 0; i < plen; i++) {
        pHash = (pHash + (long long)(pattern[i]+1) * power) % MOD;
        tHash = (tHash + (long long)(text[i]+1) * power) % MOD;
        if (i < plen-1) power = power * BASE % MOD;
    }

    long long invBase = modpow(BASE, MOD-2, MOD);

    for (i = 0; i <= tlen-plen; i++) {
        if (tHash == pHash) {
            int match = 1;
            for (j = 0; j < plen; j++) if (text[i+j] != pattern[j]) { match = 0; break; }
            if (match) return i;
        }
        if (i < tlen-plen) {
            tHash = ((tHash - (text[i]+1)) % MOD + MOD) % MOD;
            tHash = tHash * invBase % MOD;
            tHash = (tHash + (long long)(text[i+plen]+1) * power) % MOD;
        }
    }
    return -1;
}

int main() {
    int a1[] = {5, 1, 2, 3, 4, 5, 2, 1, 2}; printf("%d\n", robin_karp_rolling_hash(a1, 9));
    int a2[] = {5, 1, 2, 3, 4, 5, 2, 3, 4}; printf("%d\n", robin_karp_rolling_hash(a2, 9));
    int a3[] = {4, 1, 2, 3, 4, 2, 5, 6}; printf("%d\n", robin_karp_rolling_hash(a3, 8));
    int a4[] = {4, 1, 2, 3, 4, 1, 4}; printf("%d\n", robin_karp_rolling_hash(a4, 7));
    return 0;
}
