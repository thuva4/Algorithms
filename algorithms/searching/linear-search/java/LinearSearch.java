package algorithms.searching.linearsearch;

public class LinearSearch {
    public static int search(int[] arr, int target) {
        if (arr == null) return -1;
        
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target)
                return i;
        }
        return -1;
    }
}
