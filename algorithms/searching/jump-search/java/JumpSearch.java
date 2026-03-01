package algorithms.searching.jumpsearch;

public class JumpSearch {
    public static int search(int[] arr, int target) {
        int n = arr.length;
        if (n == 0) return -1;
        
        int step = (int)Math.sqrt(n);
        int prev = 0;
        
        while (arr[Math.min(step, n) - 1] < target) {
            prev = step;
            step += (int)Math.sqrt(n);
            if (prev >= n)
                return -1;
        }
        
        while (arr[prev] < target) {
            prev++;
            if (prev == Math.min(step, n))
                return -1;
        }
        
        if (arr[prev] == target)
            return prev;
            
        return -1;
    }
}
