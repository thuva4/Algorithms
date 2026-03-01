#include "chinese_remainder.h"

static long long ext_gcd(long long a, long long b, long long *x, long long *y) {
    if (a == 0) { *x = 0; *y = 1; return b; }
    long long x1, y1;
    long long g = ext_gcd(b % a, a, &x1, &y1);
    *x = y1 - (b / a) * x1;
    *y = x1;
    return g;
}

int chinese_remainder(int arr[], int size) {
    int n = arr[0];
    long long r = arr[1];
    long long m = arr[2];

    for (int i = 1; i < n; i++) {
        long long r2 = arr[1 + 2 * i];
        long long m2 = arr[2 + 2 * i];
        long long p, q;
        long long g = ext_gcd(m, m2, &p, &q);
        long long lcm = m / g * m2;
        r = (r + m * (((r2 - r) / g) % (m2 / g)) * p) % lcm;
        if (r < 0) r += lcm;
        m = lcm;
    }

    return (int)(r % m);
}
