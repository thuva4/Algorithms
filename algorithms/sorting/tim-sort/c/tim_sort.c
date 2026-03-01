#include "tim_sort.h"

#define MIN(a,b) (((a)<(b))?(a):(b))

const int RUN = 32;

static void insertion_sort(int arr[], int left, int right) {
    for (int i = left + 1; i <= right; i++) {
        int temp = arr[i];
        int j = i - 1;
        while (j >= left && arr[j] > temp) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = temp;
    }
}

static void merge(int arr[], int l, int m, int r) {
    int len1 = m - l + 1, len2 = r - m;
    int left[len1], right[len2];
    
    for (int i = 0; i < len1; i++)
        left[i] = arr[l + i];
    for (int i = 0; i < len2; i++)
        right[i] = arr[m + 1 + i];
        
    int i = 0, j = 0, k = l;
    
    while (i < len1 && j < len2) {
        if (left[i] <= right[j]) {
            arr[k] = left[i];
            i++;
        } else {
            arr[k] = right[j];
            j++;
        }
        k++;
    }
    
    while (i < len1) {
        arr[k] = left[i];
        k++;
        i++;
    }
    
    while (j < len2) {
        arr[k] = right[j];
        k++;
        j++;
    }
}

void tim_sort(int arr[], int n) {
    for (int i = 0; i < n; i += RUN)
        insertion_sort(arr, i, MIN((i + RUN - 1), (n - 1)));
        
    for (int size = RUN; size < n; size = 2 * size) {
        for (int left = 0; left < n; left += 2 * size) {
            int mid = left + size - 1;
            int right = MIN((left + 2 * size - 1), (n - 1));
            
            if (mid < right)
                merge(arr, left, mid, right);
        }
    }
}
