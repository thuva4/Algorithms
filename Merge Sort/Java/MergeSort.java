public class MergeSort {

    public static void sort(int[] a) {
        int[] helper = new int[a.length];
        sort(a, 0, a.length - 1, helper);

    }

    public static void sort(int[] a, int low, int high, int[] helper) {
        if (low >= high) {
            return;
        }
        int middle = low + (high - low) / 2;
        sort(a, low, middle, helper);
        sort(a, middle + 1, high, helper);
        merge(a, low, middle, high, helper);
    }

    public static void merge(int[] a, int low, int middle, int high, int[] helper) {
        for (int i = low; i <= high; i++) {
            helper[i] = a[i];
        }
        int i = low;
        int j = middle + 1;

        for (int k = low; k <= high; k++) {
            if (i > middle) {
                a[k] = helper[j++];
            } else if (j > high) {
                a[k] = helper[i++];
            } else if (helper[i] <= helper[j]) {
                a[k] = helper[i++];
            } else {
                a[k] = helper[j++];
            }
        }
    }
}
