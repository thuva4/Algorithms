import java.util.Arrays;

public class HeapSort {
    /**
     * Heap Sort implementation.
     * Sorts an array by first building a max heap, then repeatedly extracting the maximum element.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }

        int[] result = Arrays.copyOf(arr, arr.length);
        int n = result.length;

        // Build max heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(result, n, i);
        }

        // Extract elements
        for (int i = n - 1; i > 0; i--) {
            int temp = result[0];
            result[0] = result[i];
            result[i] = temp;

            heapify(result, i, 0);
        }

        return result;
    }

    private static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int l = 2 * i + 1;
        int r = 2 * i + 2;

        if (l < n && arr[l] > arr[largest]) {
            largest = l;
        }

        if (r < n && arr[r] > arr[largest]) {
            largest = r;
        }

        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;

            heapify(arr, n, largest);
        }
    }
}
