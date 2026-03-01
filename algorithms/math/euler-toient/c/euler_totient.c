int euler_totient(int n) {
    if (n == 0) return 0;
    int result = n;
    int x = n;

    for (int p = 2; p * p <= x; p++) {
        if (x % p == 0) {
            while (x % p == 0) {
                x /= p;
            }
            result -= result / p;
        }
    }

    if (x > 1) {
        result -= result / x;
    }

    return result;
}
