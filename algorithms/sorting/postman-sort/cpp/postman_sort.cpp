#include "postman_sort.h"
#include <vector>
#include <algorithm>
#include <cmath>

static int get_max(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int max_val = arr[0];
    for (int x : arr) {
        if (x > max_val) max_val = x;
    }
    return max_val;
}

static int get_min(const std::vector<int>& arr) {
    if (arr.empty()) return 0;
    int min_val = arr[0];
    for (int x : arr) {
        if (x < min_val) min_val = x;
    }
    return min_val;
}

void postman_sort(std::vector<int>& arr) {
    if (arr.empty()) return;
    
    int min_val = get_min(arr);
    int offset = 0;
    
    if (min_val < 0) {
        offset = -min_val;
        for (size_t i = 0; i < arr.size(); i++) {
            arr[i] += offset;
        }
    }
    
    int max_val = get_max(arr);
    int n = arr.size();
    
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
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
    
    if (offset > 0) {
        for (size_t i = 0; i < arr.size(); i++) {
            arr[i] -= offset;
        }
    }
}
