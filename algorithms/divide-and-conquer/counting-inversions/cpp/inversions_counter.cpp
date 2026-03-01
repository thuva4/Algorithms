#include <vector>

namespace {
long long merge_count(std::vector<int>& values, std::vector<int>& buffer, int left, int right) {
    if (right - left <= 1) {
        return 0;
    }

    int mid = left + (right - left) / 2;
    long long inversions = merge_count(values, buffer, left, mid);
    inversions += merge_count(values, buffer, mid, right);

    int i = left;
    int j = mid;
    int k = left;
    while (i < mid && j < right) {
        if (values[i] <= values[j]) {
            buffer[k++] = values[i++];
        } else {
            buffer[k++] = values[j++];
            inversions += mid - i;
        }
    }

    while (i < mid) {
        buffer[k++] = values[i++];
    }
    while (j < right) {
        buffer[k++] = values[j++];
    }
    for (int index = left; index < right; ++index) {
        values[index] = buffer[index];
    }

    return inversions;
}
}  // namespace

long long count_inversions(std::vector<int> values) {
    std::vector<int> buffer(values.size(), 0);
    return merge_count(values, buffer, 0, static_cast<int>(values.size()));
}
