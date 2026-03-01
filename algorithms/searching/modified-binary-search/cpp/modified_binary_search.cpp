#include "modified_binary_search.h"
#include <vector>

int modified_binary_search(const std::vector<int>& arr, int target) {
    if (arr.empty()) return -1;
    
    int start = 0;
    int end = arr.size() - 1;
    
    bool isAscending = arr[start] <= arr[end];
    
    while (start <= end) {
        int mid = start + (end - start) / 2;
        
        if (arr[mid] == target)
            return mid;
            
        if (isAscending) {
            if (target < arr[mid])
                end = mid - 1;
            else
                start = mid + 1;
        } else {
            if (target > arr[mid])
                end = mid - 1;
            else
                start = mid + 1;
        }
    }
    return -1;
}
