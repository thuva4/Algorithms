#include "radix_sort.h"
#include <vector>
#include <algorithm>
#include <cmath>

static int get_max(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int max = arr[0];
    for (int x : arr)
        if (x > max) max = x;
    return max;
}

static int get_min(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int min = arr[0];
    for (int x : arr)
        if (x < min) min = x;
    return min;
}

static void count_sort(std::vector<int>& arr, int exp) {
    int n = arr.size();
    std::vector<int> output(n);
    int count[10] = {0};

    for (int i = 0; i < n; i++)
        count[(arr[i] / exp) % 10]++;

    for (int i = 1; i < 10; i++)
        count[i] += count[i - 1];

    for (int i = n - 1; i >= 0; i--) {
        output[count[(arr[i] / exp) % 10] - 1] = arr[i];
        count[(arr[i] / exp) % 10]--;
    }

    for (int i = 0; i < n; i++)
        arr[i] = output[i];
}

void radix_sort(std::vector<int>& arr) {
    if (arr.empty()) return;
    
    int min_val = get_min(arr);
    int offset = 0;
    
    if (min_val < 0) {
        offset = -min_val;
        for (size_t i = 0; i < arr.size(); i++) {
            arr[i] += offset;
        }
    }
    
    int max = get_max(arr);

    for (int exp = 1; max / exp > 0; exp *= 10)
        count_sort(arr, exp);
        
    if (offset > 0) {
        for (size_t i = 0; i < arr.size(); i++) {
            arr[i] -= offset;
        }
    }
}
