public class SubsetSum {

    public static int subsetSum(int[] arr, int target) {
        return backtrack(arr, 0, target) ? 1 : 0;
    }

    private static boolean backtrack(int[] arr, int index, int remaining) {
        if (remaining == 0) {
            return true;
        }
        if (index >= arr.length) {
            return false;
        }
        // Include arr[index]
        if (backtrack(arr, index + 1, remaining - arr[index])) {
            return true;
        }
        // Exclude arr[index]
        if (backtrack(arr, index + 1, remaining)) {
            return true;
        }
        return false;
    }
}
