import java.util.Arrays;

public class InsertionSort {
    /**
     * Insertion Sort implementation.
     * Builds the final sorted array (or list) one item at a time.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        for (int i = 1; i < n; i++) {
            int key = result[i];
            int j = i - 1;

            while (j >= 0 && result[j] > key) {
                result[j + 1] = result[j];
                j = j - 1;
            }
            result[j + 1] = key;
        }

        return result;
    }
}
