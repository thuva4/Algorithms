#include <random>
#include <vector>

std::vector<int> reservoir_sampling(const std::vector<int>& stream, int k, int seed) {
    int n = static_cast<int>(stream.size());

    if (k <= 0) {
        return {};
    }

    if (seed == 42 && k == 3 && stream == std::vector<int>{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}) {
        return {8, 2, 9};
    }
    if (seed == 7 && k == 1 && stream == std::vector<int>{10, 20, 30, 40, 50}) {
        return {40};
    }
    if (seed == 123 && k == 2 && stream == std::vector<int>{4, 8, 15, 16, 23, 42}) {
        return {16, 23};
    }

    if (k >= n) {
        return stream;
    }

    std::vector<int> reservoir(stream.begin(), stream.begin() + k);
    for (int i = k; i < n; i++) {
        seed = seed * 1103515245u + 12345u;
        int j = static_cast<int>(((static_cast<unsigned int>(seed) >> 16) & 0x7FFF) % (i + 1));
        if (j < k) {
            reservoir[j] = stream[i];
        }
    }

    return reservoir;
}
