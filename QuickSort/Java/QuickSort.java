

public class QuickSort {
    public static void sort(int[] a) {
        sort(a, 0, a.length - 1);
    }

    public static void sort(int[] a, int low, int high) {
        if (low >= high) return;

        int middle = partition(a, low, high);
        sort(a, low, middle - 1);
        sort(a, middle + 1, high);
    }

    private static int partition(int[] a, int low, int high) {
        int middle = low + (high - low) / 2;
        swap(a, middle, high);
        int storeIndex = low;
        for (int i = low; i < high; i++) {
            if (a[i] < a[high]) {
                swap(a, storeIndex, i);
                storeIndex++;
            }
        }
        swap(a, high, storeIndex);
        return storeIndex;
    }

    private static void swap(int[] a, int i, int j) {
        int temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}
