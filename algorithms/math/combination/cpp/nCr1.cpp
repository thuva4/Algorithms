#include <algorithm>

long long nCr(long long n, long long r) {
    if (r < 0 || r > n) {
        return 0;
    }
    r = std::min(r, n - r);
    long long result = 1;
    for (long long i = 1; i <= r; ++i) {
        result = (result * (n - r + i)) / i;
    }
    return result;
}
