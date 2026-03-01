import java.util.Arrays;
import java.util.Random;

public class BogoSort {
    private static final Random random = new Random();

    /**
     * Bogo Sort implementation.
     * Repeatedly shuffles the array until it's sorted.
     * WARNING: Highly inefficient for large arrays.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return arr == null ? new int[0] : Arrays.copyOf(arr, arr.length);
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        while (!isSorted(result)) {
            shuffle(result);
        }
        return result;
    }

    private static boolean isSorted(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                return false;
            }
        }
        return true;
    }

    private static void shuffle(int[] arr) {
        for (int i = arr.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    public static void main(String[] args) {
        int[] a = {3, 1, 2};
        int[] sorted = sort(a);
        System.out.println("Sorted array: " + Arrays.toString(sorted));
    }
}
