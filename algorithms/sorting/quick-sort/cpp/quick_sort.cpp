#include "quick_sort.h"
#include <vector>
#include <algorithm>

// Partition function using Lomuto partition scheme
static int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            std::swap(arr[i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return (i + 1);
}

static void quick_sort_recursive(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        
        quick_sort_recursive(arr, low, pi - 1);
        quick_sort_recursive(arr, pi + 1, high);
    }
}

void quick_sort(std::vector<int>& arr) {
    if (!arr.empty()) {
        quick_sort_recursive(arr, 0, arr.size() - 1);
    }
}
