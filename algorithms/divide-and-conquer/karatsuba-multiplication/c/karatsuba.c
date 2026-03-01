#include "karatsuba.h"
#include <math.h>

static int num_digits(long long n) {
    if (n == 0) return 1;
    int count = 0;
    if (n < 0) n = -n;
    while (n > 0) { count++; n /= 10; }
    return count;
}

static long long multiply(long long x, long long y) {
    if (x < 10 || y < 10) return x * y;

    int nx = num_digits(x);
    int ny = num_digits(y);
    int n = nx > ny ? nx : ny;
    int half = n / 2;
    long long power = 1;
    for (int i = 0; i < half; i++) power *= 10;

    long long x1 = x / power, x0 = x % power;
    long long y1 = y / power, y0 = y % power;

    long long z0 = multiply(x0, y0);
    long long z2 = multiply(x1, y1);
    long long z1 = multiply(x0 + x1, y0 + y1) - z0 - z2;

    return z2 * power * power + z1 * power + z0;
}

int karatsuba(int* arr, int len) {
    return (int)multiply(arr[0], arr[1]);
}
