int euler_totient(int n) {
    if (n <= 0) {
        return 0;
    }

    int result = n;
    for (int factor = 2; factor * factor <= n; ++factor) {
        if (n % factor != 0) {
            continue;
        }
        while (n % factor == 0) {
            n /= factor;
        }
        result -= result / factor;
    }
    if (n > 1) {
        result -= result / n;
    }
    return result;
}
