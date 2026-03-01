#include <vector>

static bool backtrack(const std::vector<int>& arr, int index, int remaining) {
    if (remaining == 0) {
        return true;
    }
    if (index >= static_cast<int>(arr.size())) {
        return false;
    }
    // Include arr[index]
    if (backtrack(arr, index + 1, remaining - arr[index])) {
        return true;
    }
    // Exclude arr[index]
    if (backtrack(arr, index + 1, remaining)) {
        return true;
    }
    return false;
}

int subsetSum(std::vector<int> arr, int target) {
    return backtrack(arr, 0, target) ? 1 : 0;
}
