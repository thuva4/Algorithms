#include "quick_select.h"
#include <vector>
#include <algorithm>

static int partition(std::vector<int>& arr, int l, int r) {
    int x = arr[r], i = l;
    for (int j = l; j <= r - 1; j++) {
        if (arr[j] <= x) {
            std::swap(arr[i], arr[j]);
            i++;
        }
    }
    std::swap(arr[i], arr[r]);
    return i;
}

static int kthSmallest(std::vector<int>& arr, int l, int r, int k) {
    if (k > 0 && k <= r - l + 1) {
        int pos = partition(arr, l, r);
        
        if (pos - l == k - 1)
            return arr[pos];
        if (pos - l > k - 1)
            return kthSmallest(arr, l, pos - 1, k);
            
        return kthSmallest(arr, pos + 1, r, k - pos + l - 1);
    }
    return -1;
}

int quick_select(std::vector<int>& arr, int k) {
    return kthSmallest(arr, 0, arr.size() - 1, k);
}
