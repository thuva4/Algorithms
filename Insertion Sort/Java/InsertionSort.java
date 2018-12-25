import java.util.Arrays;

public class InsertionSort {

    private static void insertionSort(int[] inputArray) {
        int n = inputArray.length;

        for (int i = 1; i < n; i++) {
            int key = inputArray[i];
            int j = i - 1;

            while (j >= 0 && inputArray[j] > key) {
                inputArray[j + 1] = inputArray[j];
                j = j - 1;
            }
            inputArray[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] arr = {80, 12, 11, -5, 1, 0, 23, 2, 3, 4, 9};

        // before
        System.out.println(Arrays.toString(arr));

        insertionSort(arr);

        // after
        System.out.println(Arrays.toString(arr));
    }
}