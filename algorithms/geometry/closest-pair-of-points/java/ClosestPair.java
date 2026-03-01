import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

public class ClosestPair {

    public static int closestPair(int[] arr) {
        int n = arr.length / 2;
        int[][] points = new int[n][2];
        for (int i = 0; i < n; i++) {
            points[i][0] = arr[2 * i];
            points[i][1] = arr[2 * i + 1];
        }
        Arrays.sort(points, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
        return solve(points, 0, n - 1);
    }

    private static int distSq(int[] p1, int[] p2) {
        return (p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]);
    }

    private static int solve(int[][] points, int l, int r) {
        if (r - l < 3) {
            int min = Integer.MAX_VALUE;
            for (int i = l; i <= r; i++) {
                for (int j = i + 1; j <= r; j++) {
                    min = Math.min(min, distSq(points[i], points[j]));
                }
            }
            return min;
        }

        int mid = (l + r) / 2;
        int midX = points[mid][0];

        int dl = solve(points, l, mid);
        int dr = solve(points, mid + 1, r);
        int d = Math.min(dl, dr);

        List<int[]> strip = new ArrayList<>();
        for (int i = l; i <= r; i++) {
            if ((points[i][0] - midX) * (points[i][0] - midX) < d) {
                strip.add(points[i]);
            }
        }
        strip.sort((a, b) -> a[1] - b[1]);

        for (int i = 0; i < strip.size(); i++) {
            for (int j = i + 1; j < strip.size() &&
                    (strip.get(j)[1] - strip.get(i)[1]) * (strip.get(j)[1] - strip.get(i)[1]) < d; j++) {
                d = Math.min(d, distSq(strip.get(i), strip.get(j)));
            }
        }

        return d;
    }
}
