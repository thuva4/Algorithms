int discrete_logarithm(long long base, long long target, long long modulus) {
    if (modulus <= 0) {
        return -1;
    }
    if (modulus == 1) {
        return 0;
    }

    base %= modulus;
    target %= modulus;

    long long value = 1 % modulus;
    for (int exponent = 0; exponent <= modulus; ++exponent) {
        if (value == target) {
            return exponent;
        }
        value = (value * base) % modulus;
    }
    return -1;
}
