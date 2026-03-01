bool is_prime(int n) {
    if (n < 2) {
        return false;
    }
    if (n % 2 == 0) {
        return n == 2;
    }
    for (int factor = 3; factor * factor <= n; factor += 2) {
        if (n % factor == 0) {
            return false;
        }
    }
    return true;
}
