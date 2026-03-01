import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BucketSort {
    /**
     * Bucket Sort implementation.
     * Divides the input into several buckets, each of which is then sorted individually.
     * @param arr the input array
     * @return a sorted copy of the array
     */
    public static int[] sort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return arr == null ? new int[0] : Arrays.copyOf(arr, arr.length);
        }

        int n = arr.length;
        int min = arr[0];
        int max = arr[0];

        for (int i = 1; i < n; i++) {
            if (arr[i] < min) min = arr[i];
            if (arr[i] > max) max = arr[i];
        }

        if (min == max) {
            return Arrays.copyOf(arr, n);
        }

        // Initialize buckets
        List<List<Integer>> buckets = new ArrayList<>(n);
        for (int i = 0; i < n; i++) {
            buckets.add(new ArrayList<>());
        }

        long range = (long) max - min;

        // Distribute elements into buckets
        for (int x : arr) {
            int index = (int) ((long) (x - min) * (n - 1) / range);
            buckets.get(index).add(x);
        }

        // Sort each bucket and merge
        int[] result = new int[n];
        int k = 0;
        for (List<Integer> bucket : buckets) {
            // Sort bucket using insertion sort logic
            for (int i = 1; i < bucket.size(); i++) {
                int key = bucket.get(i);
                int j = i - 1;
                while (j >= 0 && bucket.get(j) > key) {
                    bucket.set(j + 1, bucket.get(j));
                    j--;
                }
                bucket.set(j + 1, key);
            }
            for (int x : bucket) {
                result[k++] = x;
            }
        }

        return result;
    }
}
