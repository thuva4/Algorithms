package algorithms.searching.binarysearch;

public class BinarySearch {
    public static int search(int[] arr, int target) {
        if (arr == null) return -1;
        
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target)
                return mid;
                
            if (arr[mid] < target)
                left = mid + 1;
            else
                right = mid - 1;
        }
        
        return -1;
    }
}
