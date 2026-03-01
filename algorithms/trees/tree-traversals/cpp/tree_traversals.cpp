#include <vector>

static void inorder(const std::vector<int>& arr, int i, std::vector<int>& result) {
    if (i >= (int)arr.size() || arr[i] == -1) return;
    inorder(arr, 2 * i + 1, result);
    result.push_back(arr[i]);
    inorder(arr, 2 * i + 2, result);
}

std::vector<int> tree_traversals(std::vector<int> arr) {
    std::vector<int> result;
    inorder(arr, 0, result);
    return result;
}
