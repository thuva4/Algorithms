import java.util.Arrays;

public class ConvexHull {

    public static int convexHullCount(int[] arr) {
        int n = arr[0];
        if (n <= 2) return n;

        int[][] points = new int[n][2];
        int idx = 1;
        for (int i = 0; i < n; i++) {
            points[i][0] = arr[idx++];
            points[i][1] = arr[idx++];
        }
        Arrays.sort(points, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);

        int[][] hull = new int[2 * n][2];
        int k = 0;

        for (int i = 0; i < n; i++) {
            while (k >= 2 && cross(hull[k-2], hull[k-1], points[i]) <= 0) k--;
            hull[k++] = points[i];
        }

        int lower = k + 1;
        for (int i = n - 2; i >= 0; i--) {
            while (k >= lower && cross(hull[k-2], hull[k-1], points[i]) <= 0) k--;
            hull[k++] = points[i];
        }

        return k - 1;
    }

    private static long cross(int[] o, int[] a, int[] b) {
        return (long)(a[0] - o[0]) * (b[1] - o[1]) - (long)(a[1] - o[1]) * (b[0] - o[0]);
    }
}
