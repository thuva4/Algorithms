#include <vector>
#include <algorithm>

/**
 * Bucket Sort implementation.
 * Divides the input into several buckets, each of which is then sorted individually.
 * @param arr the input vector
 * @return a sorted copy of the vector
 */
std::vector<int> bucket_sort(const std::vector<int>& arr) {
    int n = static_cast<int>(arr.size());
    if (n <= 1) {
        return arr;
    }

    int min_val = arr[0];
    int max_val = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < min_val) min_val = arr[i];
        if (arr[i] > max_val) max_val = arr[i];
    }

    if (min_val == max_val) {
        return arr;
    }

    // Initialize buckets
    std::vector<std::vector<int>> buckets(n);
    long long range = static_cast<long long>(max_val) - min_val;

    // Distribute elements into buckets
    for (int x : arr) {
        int index = static_cast<int>((static_cast<long long>(x) - min_val) * (n - 1) / range);
        buckets[index].push_back(x);
    }

    // Sort each bucket and merge
    std::vector<int> result;
    result.reserve(n);
    for (auto& bucket : buckets) {
        // Sort using insertion sort logic or std::sort for simplicity and performance
        std::sort(bucket.begin(), bucket.end());
        for (int x : bucket) {
            result.push_back(x);
        }
    }

    return result;
}
