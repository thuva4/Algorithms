#include <algorithm>
#include <vector>

int longest_bitonic_subsequence(const std::vector<int>& values) {
    if (values.empty()) {
        return 0;
    }

    int size = static_cast<int>(values.size());
    std::vector<int> inc(size, 1);
    std::vector<int> dec(size, 1);

    for (int right = 0; right < size; ++right) {
        for (int left = 0; left < right; ++left) {
            if (values[left] < values[right]) {
                inc[right] = std::max(inc[right], inc[left] + 1);
            }
        }
    }

    for (int left = size - 1; left >= 0; --left) {
        for (int right = size - 1; right > left; --right) {
            if (values[right] < values[left]) {
                dec[left] = std::max(dec[left], dec[right] + 1);
            }
        }
    }

    int best = 1;
    for (int index = 0; index < size; ++index) {
        best = std::max(best, inc[index] + dec[index] - 1);
    }
    return best;
}
