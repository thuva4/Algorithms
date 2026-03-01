package algorithms.sorting.postmansort;

import java.util.Arrays;

public class PostmanSort {
    public static void sort(int[] arr) {
        if (arr == null || arr.length == 0) {
            return;
        }

        int min = Arrays.stream(arr).min().getAsInt();
        int offset = 0;
        
        if (min < 0) {
            offset = Math.abs(min);
            for (int i = 0; i < arr.length; i++) {
                arr[i] += offset;
            }
        }

        int max = Arrays.stream(arr).max().getAsInt();

        for (int exp = 1; max / exp > 0; exp *= 10) {
            countSort(arr, exp);
        }
        
        if (offset > 0) {
            for (int i = 0; i < arr.length; i++) {
                arr[i] -= offset;
            }
        }
    }

    private static void countSort(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];
        int[] count = new int[10];

        for (int i = 0; i < n; i++) {
            count[(arr[i] / exp) % 10]++;
        }

        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (int i = n - 1; i >= 0; i--) {
            output[count[(arr[i] / exp) % 10] - 1] = arr[i];
            count[(arr[i] / exp) % 10]--;
        }

        System.arraycopy(output, 0, arr, 0, n);
    }
}
