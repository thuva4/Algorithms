#include "quick_sort.h"
#include <stdio.h>

// Helper function to swap two elements
static void swap(int* a, int* b) {
    int t = *a;
    *a = *b;
    *b = t;
}

// Partition function using Lomuto partition scheme
static int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

static void quick_sort_recursive(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        
        quick_sort_recursive(arr, low, pi - 1);
        quick_sort_recursive(arr, pi + 1, high);
    }
}

void quick_sort(int arr[], int n) {
    if (n > 0) {
        quick_sort_recursive(arr, 0, n - 1);
    }
}
