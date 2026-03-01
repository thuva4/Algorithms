#include <cmath>

bool is_prime(int n) {
    if (n < 2) {
        return false;
    }
    if (n % 2 == 0) {
        return n == 2;
    }
    int limit = static_cast<int>(std::sqrt(static_cast<double>(n)));
    for (int factor = 3; factor <= limit; factor += 2) {
        if (n % factor == 0) {
            return false;
        }
    }
    return true;
}
