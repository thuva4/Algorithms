package algorithms.searching.exponentialsearch;

import java.util.Arrays;

public class ExponentialSearch {
    public static int search(int[] arr, int target) {
        if (arr == null || arr.length == 0) return -1;
        if (arr[0] == target) return 0;
        
        int n = arr.length;
        int i = 1;
        while (i < n && arr[i] <= target)
            i = i * 2;
            
        return Arrays.binarySearch(arr, i / 2, Math.min(i, n), target) >= 0 
               ? Arrays.binarySearch(arr, i / 2, Math.min(i, n), target) 
               : -1;
    }
    
    // Custom binary search if we don't want to rely on Arrays.binarySearch's negative return for not found
    private static int binarySearch(int[] arr, int l, int r, int target) {
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (arr[mid] == target)
                return mid;
            if (arr[mid] < target)
                l = mid + 1;
            else
                r = mid - 1;
        }
        return -1;
    }
}
