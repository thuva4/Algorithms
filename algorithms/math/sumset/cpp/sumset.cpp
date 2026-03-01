#include <algorithm>
#include <vector>

std::vector<int> sumset(const std::vector<int>& set_a, const std::vector<int>& set_b) {
    std::vector<int> result;
    result.reserve(set_a.size() * set_b.size());

    for (int a : set_a) {
        for (int b : set_b) {
            result.push_back(a + b);
        }
    }

    std::sort(result.begin(), result.end());
    return result;
}
