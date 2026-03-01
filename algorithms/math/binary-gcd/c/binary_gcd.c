static int abs_int(int x) {
    return x < 0 ? -x : x;
}

int binary_gcd(int a, int b) {
    a = abs_int(a);
    b = abs_int(b);
    if (a == 0) return b;
    if (b == 0) return a;

    int shift = 0;
    while (((a | b) & 1) == 0) {
        a >>= 1;
        b >>= 1;
        shift++;
    }

    while ((a & 1) == 0) {
        a >>= 1;
    }

    while (b != 0) {
        while ((b & 1) == 0) {
            b >>= 1;
        }
        if (a > b) {
            int temp = a;
            a = b;
            b = temp;
        }
        b -= a;
    }

    return a << shift;
}
