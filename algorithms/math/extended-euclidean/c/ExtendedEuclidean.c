static int extended_gcd_impl(int a, int b, int *x, int *y) {
    if (a == 0) {
        *x = 0;
        *y = 1;
        return b;
    }

    int x1 = 0;
    int y1 = 0;
    int gcd = extended_gcd_impl(b % a, a, &x1, &y1);

    *x = y1 - (b / a) * x1;
    *y = x1;
    return gcd;
}

void extended_gcd(int a, int b, int result[]) {
    int x = 0;
    int y = 0;
    int gcd = extended_gcd_impl(a, b, &x, &y);
    result[0] = gcd;
    result[1] = x;
    result[2] = y;
}
