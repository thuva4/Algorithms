package algorithms.searching.ternarysearch;

public class TernarySearch {
    public static int search(int[] arr, int target) {
        if (arr == null) return -1;
        
        int l = 0;
        int r = arr.length - 1;
        
        while (r >= l) {
            int mid1 = l + (r - l) / 3;
            int mid2 = r - (r - l) / 3;
            
            if (arr[mid1] == target)
                return mid1;
            if (arr[mid2] == target)
                return mid2;
                
            if (target < arr[mid1]) {
                r = mid1 - 1;
            } else if (target > arr[mid2]) {
                l = mid2 + 1;
            } else {
                l = mid1 + 1;
                r = mid2 - 1;
            }
        }
        return -1;
    }
}
