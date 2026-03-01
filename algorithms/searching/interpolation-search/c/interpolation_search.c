#include "interpolation_search.h"

int interpolation_search(int arr[], int n, int target) {
    int lo = 0, hi = n - 1;
    
    while (lo <= hi && target >= arr[lo] && target <= arr[hi]) {
        if (lo == hi) {
            if (arr[lo] == target) return lo;
            return -1;
        }
        
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
