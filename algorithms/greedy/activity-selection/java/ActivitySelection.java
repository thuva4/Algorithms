import java.util.Arrays;

public class ActivitySelection {

    public static int activitySelection(int[] arr) {
        int n = arr.length / 2;
        if (n == 0) {
            return 0;
        }

        int[][] activities = new int[n][2];
        for (int i = 0; i < n; i++) {
            activities[i][0] = arr[2 * i];
            activities[i][1] = arr[2 * i + 1];
        }

        Arrays.sort(activities, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 1;
        int lastFinish = activities[0][1];

        for (int i = 1; i < n; i++) {
            if (activities[i][0] >= lastFinish) {
                count++;
                lastFinish = activities[i][1];
            }
        }

        return count;
    }
}
