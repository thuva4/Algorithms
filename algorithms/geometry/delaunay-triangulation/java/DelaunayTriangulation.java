public class DelaunayTriangulation {

    public static int delaunayTriangulation(int[] arr) {
        int n = arr[0];
        if (n < 3) return 0;
        int hullSize = convexHullSize(arr, n);
        return Math.max(0, 2 * n - 2 - hullSize);
    }

    private static int convexHullSize(int[] arr, int n) {
        int[] order = new int[n];
        for (int i = 0; i < n; i++) {
            order[i] = i;
        }

        for (int i = 0; i < n; i++) {
            int best = i;
            for (int j = i + 1; j < n; j++) {
                int bx = arr[1 + 2 * best];
                int by = arr[1 + 2 * best + 1];
                int jx = arr[1 + 2 * j];
                int jy = arr[1 + 2 * j + 1];
                if (jx < bx || (jx == bx && jy < by)) {
                    best = j;
                }
            }
            int temp = order[i];
            order[i] = order[best];
            order[best] = temp;
        }

        int[] hull = new int[2 * n];
        int size = 0;

        for (int idx : order) {
            while (size >= 2 && cross(arr, hull[size - 2], hull[size - 1], idx) <= 0) {
                size--;
            }
            hull[size++] = idx;
        }

        int lowerSize = size;
        for (int i = n - 2; i >= 0; i--) {
            int idx = order[i];
            while (size > lowerSize && cross(arr, hull[size - 2], hull[size - 1], idx) <= 0) {
                size--;
            }
            hull[size++] = idx;
        }

        return Math.max(1, size - 1);
    }

    private static long cross(int[] arr, int a, int b, int c) {
        long ax = arr[1 + 2 * a];
        long ay = arr[1 + 2 * a + 1];
        long bx = arr[1 + 2 * b];
        long by = arr[1 + 2 * b + 1];
        long cx = arr[1 + 2 * c];
        long cy = arr[1 + 2 * c + 1];
        return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    }
}
