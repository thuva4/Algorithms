#include "jump_search.h"
#include <vector>
#include <cmath>
#include <algorithm>

int jump_search(const std::vector<int>& arr, int target) {
    int n = arr.size();
    if (n == 0) return -1;
    
    int step = std::sqrt(n);
    int prev = 0;
    
    while (arr[std::min(step, n) - 1] < target) {
        prev = step;
        step += std::sqrt(n);
        if (prev >= n)
            return -1;
    }
    
    while (arr[prev] < target) {
        prev++;
        if (prev == std::min(step, n))
            return -1;
    }
    
    if (arr[prev] == target)
        return prev;
        
    return -1;
}
