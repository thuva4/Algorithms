import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Collections;

public class PartialSort {
    public static int[] partialSort(int[] arr) {
        if (arr == null) {
            return new int[0];
        }
        int[] result = arr.clone();
        Arrays.sort(result);
        return result;
    }

    /**
     * Partial Sort implementation.
     * Returns the smallest k elements of the array in sorted order.
     * If k >= len(arr), returns the fully sorted array.
     * @param arr the input array
     * @param k the number of smallest elements to return
     * @return a sorted array containing the k smallest elements
     */
    public static int[] sort(int[] arr, int k) {
        if (arr == null || k <= 0) {
            return new int[0];
        }
        if (k >= arr.length) {
            int[] result = arr.clone();
            Arrays.sort(result);
            return result;
        }

        // Use a max-heap to keep track of the k smallest elements
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

        for (int num : arr) {
            maxHeap.offer(num);
            if (maxHeap.size() > k) {
                maxHeap.poll();
            }
        }

        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) {
            result[i] = maxHeap.poll();
        }

        return result;
    }
}
