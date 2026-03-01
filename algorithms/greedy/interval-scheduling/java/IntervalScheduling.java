import java.util.Arrays;

public class IntervalScheduling {

    public static int intervalScheduling(int[] arr) {
        int n = arr[0];
        int[][] intervals = new int[n][2];
        for (int i = 0; i < n; i++) {
            intervals[i][0] = arr[1 + 2 * i];
            intervals[i][1] = arr[1 + 2 * i + 1];
        }

        Arrays.sort(intervals, (a, b) -> a[1] - b[1]);

        int count = 0;
        int lastEnd = -1;

        for (int[] interval : intervals) {
            if (interval[0] >= lastEnd) {
                count++;
                lastEnd = interval[1];
            }
        }

        return count;
    }
}
