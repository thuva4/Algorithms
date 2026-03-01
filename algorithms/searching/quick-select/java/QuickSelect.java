package algorithms.searching.quickselect;

public class QuickSelect {
    public static int select(int[] arr, int k) {
        return kthSmallest(arr, 0, arr.length - 1, k);
    }

    private static int kthSmallest(int[] arr, int l, int r, int k) {
        if (k > 0 && k <= r - l + 1) {
            int pos = partition(arr, l, r);

            if (pos - l == k - 1)
                return arr[pos];
            if (pos - l > k - 1)
                return kthSmallest(arr, l, pos - 1, k);

            return kthSmallest(arr, pos + 1, r, k - pos + l - 1);
        }
        return -1;
    }

    private static int partition(int[] arr, int l, int r) {
        int x = arr[r], i = l;
        for (int j = l; j <= r - 1; j++) {
            if (arr[j] <= x) {
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                i++;
            }
        }
        int temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
        return i;
    }
}
