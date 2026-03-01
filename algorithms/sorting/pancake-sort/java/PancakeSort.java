import java.util.Arrays;

public class PancakeSort {
    /**
     * Pancake Sort implementation.
     * Sorts the array by repeatedly flipping subarrays.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        for (int currSize = n; currSize > 1; currSize--) {
            int mi = findMax(result, currSize);

            if (mi != currSize - 1) {
                flip(result, mi);
                flip(result, currSize - 1);
            }
        }

        return result;
    }

    private static void flip(int[] arr, int k) {
        int i = 0;
        while (i < k) {
            int temp = arr[i];
            arr[i] = arr[k];
            arr[k] = temp;
            i++;
            k--;
        }
    }

    private static int findMax(int[] arr, int n) {
        int mi = 0;
        for (int i = 0; i < n; i++) {
            if (arr[i] > arr[mi]) {
                mi = i;
            }
        }
        return mi;
    }
}
