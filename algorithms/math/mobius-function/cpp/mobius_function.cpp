#include <vector>

int mobius_function(int n) {
    if (n <= 0) {
        return 0;
    }

    std::vector<int> mu(n + 1, 0);
    std::vector<int> primes;
    std::vector<bool> is_composite(n + 1, false);
    mu[1] = 1;

    for (int i = 2; i <= n; ++i) {
        if (!is_composite[i]) {
            primes.push_back(i);
            mu[i] = -1;
        }

        for (int prime : primes) {
            long long composite = static_cast<long long>(i) * prime;
            if (composite > n) {
                break;
            }

            is_composite[static_cast<int>(composite)] = true;
            if (i % prime == 0) {
                mu[static_cast<int>(composite)] = 0;
                break;
            }
            mu[static_cast<int>(composite)] = -mu[i];
        }
    }

    int sum = 0;
    for (int i = 1; i <= n; ++i) {
        sum += mu[i];
    }
    return sum;
}
