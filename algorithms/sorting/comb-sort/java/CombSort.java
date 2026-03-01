import java.util.Arrays;

public class CombSort {
    /**
     * Comb Sort implementation.
     * Improves on Bubble Sort by using a gap larger than 1.
     * The gap starts with a large value and shrinks by a factor of 1.3 in every iteration until it reaches 1.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;
        int gap = n;
        boolean sorted = false;
        double shrink = 1.3;

        while (!sorted) {
            gap = (int) Math.floor(gap / shrink);
            if (gap <= 1) {
                gap = 1;
                sorted = true;
            }

            for (int i = 0; i < n - gap; i++) {
                if (result[i] > result[i + gap]) {
                    int temp = result[i];
                    result[i] = result[i + gap];
                    result[i + gap] = temp;
                    sorted = false;
                }
            }
        }

        return result;
    }
}
