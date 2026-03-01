import java.util.Arrays;

public class RangeTree {
    public static int rangeTree(int[] data) {
        int n = data[0];
        int[] points = Arrays.copyOfRange(data, 1, 1 + n);
        Arrays.sort(points);
        int lo = data[1 + n], hi = data[2 + n];

        int left = lowerBound(points, lo);
        int right = upperBound(points, hi);
        return right - left;
    }

    private static int lowerBound(int[] arr, int val) {
        int lo = 0, hi = arr.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] < val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    private static int upperBound(int[] arr, int val) {
        int lo = 0, hi = arr.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (arr[mid] <= val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }

    public static void main(String[] args) {
        System.out.println(rangeTree(new int[]{5, 1, 3, 5, 7, 9, 2, 6}));
        System.out.println(rangeTree(new int[]{4, 2, 4, 6, 8, 1, 10}));
        System.out.println(rangeTree(new int[]{3, 1, 2, 3, 10, 20}));
    }
}
