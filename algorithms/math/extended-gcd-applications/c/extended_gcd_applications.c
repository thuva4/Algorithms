#include <stdio.h>
#include "extended_gcd_applications.h"

static long long ext_gcd(long long a, long long b, long long* x, long long* y) {
    if (a == 0) { *x = 0; *y = 1; return b; }
    long long x1, y1;
    long long g = ext_gcd(b % a, a, &x1, &y1);
    *x = y1 - (b / a) * x1;
    *y = x1;
    return g;
}

int extended_gcd_applications(int* arr, int size) {
    long long a = arr[0], m = arr[1];
    long long x, y;
    long long g = ext_gcd(((a % m) + m) % m, m, &x, &y);
    if (g != 1) return -1;
    return (int)(((x % m) + m) % m);
}

int main() {
    int a1[] = {3, 7}; printf("%d\n", extended_gcd_applications(a1, 2));
    int a2[] = {1, 13}; printf("%d\n", extended_gcd_applications(a2, 2));
    int a3[] = {6, 9}; printf("%d\n", extended_gcd_applications(a3, 2));
    int a4[] = {2, 11}; printf("%d\n", extended_gcd_applications(a4, 2));
    return 0;
}
