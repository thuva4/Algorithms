import java.util.Arrays;

public class CocktailSort {
    /**
     * Cocktail Sort (Bidirectional Bubble Sort) implementation.
     * Repeatedly steps through the list in both directions, comparing adjacent elements 
     * and swapping them if they are in the wrong order.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return arr == null ? new int[0] : Arrays.copyOf(arr, arr.length);
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;
        int start = 0;
        int end = n - 1;
        boolean swapped = true;

        while (swapped) {
            swapped = false;

            // Forward pass
            for (int i = start; i < end; i++) {
                if (result[i] > result[i + 1]) {
                    int temp = result[i];
                    result[i] = result[i + 1];
                    result[i + 1] = temp;
                    swapped = true;
                }
            }

            if (!swapped) {
                break;
            }

            swapped = false;
            end--;

            // Backward pass
            for (int i = end - 1; i >= start; i--) {
                if (result[i] > result[i + 1]) {
                    int temp = result[i];
                    result[i] = result[i + 1];
                    result[i + 1] = temp;
                    swapped = true;
                }
            }

            start++;
        }

        return result;
    }
}
