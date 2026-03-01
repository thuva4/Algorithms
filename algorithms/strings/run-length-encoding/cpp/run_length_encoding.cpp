#include <vector>

std::vector<int> run_length_encoding(std::vector<int> arr) {
    if (arr.empty()) return {};
    std::vector<int> result;
    int count = 1;
    for (int i = 1; i < (int)arr.size(); i++) {
        if (arr[i] == arr[i-1]) { count++; }
        else { result.push_back(arr[i-1]); result.push_back(count); count = 1; }
    }
    result.push_back(arr.back()); result.push_back(count);
    return result;
}
