#include "interpolation_search.h"
#include <vector>

int interpolation_search(const std::vector<int>& arr, int target) {
    int n = arr.size();
    if (n == 0) return -1;
    
    int lo = 0, hi = n - 1;
    
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        if (lo == hi) {
            if (arr[lo] == target) return lo;
            return -1;
        }
        
        // Prevent division by zero if arr[hi] == arr[lo] handled by lo == hi check?
        // But if lo < hi but arr[lo] == arr[hi], then division by zero.
        // The loop condition lo <= hi is standard.
        // However, if arr[lo] == arr[hi], then arr[lo] <= target <= arr[hi] implies target == arr[lo].
        // The lo == hi check handles n=1. 
        // If lo < hi and arr[lo] == arr[hi], denominator is 0.
        // We should handle arr[lo] == arr[hi] inside loop or rely on loop condition.
        // Actually if arr[lo] == arr[hi], target must be equal to them because of loop condition.
        // But the formula divides by (arr[hi] - arr[lo]).
        
        if (arr[hi] == arr[lo]) {
             if (arr[lo] == target) return lo;
             return -1;
        }
        
        int pos = lo + (((double)(hi - lo) / (arr[hi] - arr[lo])) * (target - arr[lo]));
        
        if (arr[pos] == target)
            return pos;
            
        if (arr[pos] < target)
            lo = pos + 1;
        else
            hi = pos - 1;
    }
    return -1;
}
