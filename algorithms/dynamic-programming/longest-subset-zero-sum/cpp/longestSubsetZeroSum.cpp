#include <unordered_map>
#include <vector>

int longest_subset_zero_sum(const std::vector<int>& values) {
    std::unordered_map<int, int> first_seen;
    first_seen.emplace(0, -1);

    int prefix_sum = 0;
    int best = 0;
    for (int index = 0; index < static_cast<int>(values.size()); ++index) {
        prefix_sum += values[index];
        std::unordered_map<int, int>::const_iterator found = first_seen.find(prefix_sum);
        if (found != first_seen.end()) {
            int length = index - found->second;
            if (length > best) {
                best = length;
            }
        } else {
            first_seen.emplace(prefix_sum, index);
        }
    }

    return best;
}
