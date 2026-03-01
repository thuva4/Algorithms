import java.util.Arrays;

public class BubbleSort {
    /**
     * Bubble Sort implementation.
     * Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.
     * Includes the 'swapped' flag optimization to terminate early if the array is already sorted.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }

        // Create a copy of the input array to avoid modifying it
        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        for (int i = 0; i < n - 1; i++) {
            // Optimization: track if any swaps occurred in this pass
            boolean swapped = false;

            // Last i elements are already in place, so we don't need to check them
            for (int j = 0; j < n - i - 1; j++) {
                if (result[j] > result[j + 1]) {
                    // Swap elements if they are in the wrong order
                    int temp = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = temp;
                    swapped = true;
                }
            }

            // If no two elements were swapped by inner loop, then break
            if (!swapped) {
                break;
            }
        }

        return result;
    }
}
