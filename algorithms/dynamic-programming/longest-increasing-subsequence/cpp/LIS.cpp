#include <algorithm>
#include <vector>

int lis(const std::vector<int>& values) {
    std::vector<int> tails;
    tails.reserve(values.size());

    for (int value : values) {
        std::vector<int>::iterator position = std::lower_bound(tails.begin(), tails.end(), value);
        if (position == tails.end()) {
            tails.push_back(value);
        } else {
            *position = value;
        }
    }

    return static_cast<int>(tails.size());
}
