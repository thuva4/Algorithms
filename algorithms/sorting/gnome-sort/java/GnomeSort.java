import java.util.Arrays;

public class GnomeSort {
    /**
     * Gnome Sort implementation.
     * A sorting algorithm which is similar to insertion sort in that it works with one item at a time
     * but gets the item to the proper place by a series of swaps, similar to a bubble sort.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;
        if (n < 2) {
            return result;
        }
        int index = 0;

        while (index < n) {
            if (index == 0) {
                index++;
            }
            if (result[index] >= result[index - 1]) {
                index++;
            } else {
                int temp = result[index];
                result[index] = result[index - 1];
                result[index - 1] = temp;
                index--;
            }
        }

        return result;
    }
}
