import java.util.Arrays;

public class BitonicSort {
    /**
     * Bitonic Sort implementation.
     * Works on any array size by padding to the nearest power of 2.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null || arr.length == 0) {
            return new int[0];
        }

        int n = arr.length;
        int nextPow2 = 1;
        while (nextPow2 < n) {
            nextPow2 *= 2;
        }

        // Pad the array to the next power of 2
        // We use Integer.MAX_VALUE for padding to handle ascending sort
        int[] padded = new int[nextPow2];
        Arrays.fill(padded, Integer.MAX_VALUE);
        System.arraycopy(arr, 0, padded, 0, n);

        bitonicSortRecursive(padded, 0, nextPow2, true);

        // Return the first n elements (trimmed back to original size)
        return Arrays.copyOf(padded, n);
    }

    private static void compareAndSwap(int[] arr, int i, int j, boolean ascending) {
        if ((ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j])) {
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    private static void bitonicMerge(int[] arr, int low, int cnt, boolean ascending) {
        if (cnt > 1) {
            int k = cnt / 2;
            for (int i = low; i < low + k; i++) {
                compareAndSwap(arr, i, i + k, ascending);
            }
            bitonicMerge(arr, low, k, ascending);
            bitonicMerge(arr, low + k, k, ascending);
        }
    }

    private static void bitonicSortRecursive(int[] arr, int low, int cnt, boolean ascending) {
        if (cnt > 1) {
            int k = cnt / 2;
            // Sort first half in ascending order
            bitonicSortRecursive(arr, low, k, true);
            // Sort second half in descending order
            bitonicSortRecursive(arr, low + k, k, false);
            // Merge the whole sequence in given order
            bitonicMerge(arr, low, cnt, ascending);
        }
    }

    public static void main(String[] args) {
        int[] a = {3, 7, 4, 8, 6, 2, 1, 5};
        int[] sorted = sort(a);
        System.out.println("Sorted array: " + Arrays.toString(sorted));
    }
}
