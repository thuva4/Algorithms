import java.util.Arrays;

public class JobScheduling {

    public static int jobScheduling(int[] arr) {
        int n = arr[0];
        int[][] jobs = new int[n][2];
        int maxDeadline = 0;
        for (int i = 0; i < n; i++) {
            jobs[i][0] = arr[1 + 2 * i];     // deadline
            jobs[i][1] = arr[1 + 2 * i + 1]; // profit
            maxDeadline = Math.max(maxDeadline, jobs[i][0]);
        }

        Arrays.sort(jobs, (a, b) -> b[1] - a[1]);

        boolean[] slots = new boolean[maxDeadline + 1];
        int totalProfit = 0;

        for (int[] job : jobs) {
            for (int t = Math.min(job[0], maxDeadline); t > 0; t--) {
                if (!slots[t]) {
                    slots[t] = true;
                    totalProfit += job[1];
                    break;
                }
            }
        }

        return totalProfit;
    }
}
