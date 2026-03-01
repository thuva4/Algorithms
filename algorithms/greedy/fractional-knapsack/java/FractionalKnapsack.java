import java.util.Arrays;

public class FractionalKnapsack {

    public static int fractionalKnapsack(int[] arr) {
        int capacity = arr[0];
        int n = arr[1];
        int[][] items = new int[n][2];
        int idx = 2;
        for (int i = 0; i < n; i++) {
            items[i][0] = arr[idx++];
            items[i][1] = arr[idx++];
        }

        Arrays.sort(items, (a, b) -> Double.compare((double) b[0] / b[1], (double) a[0] / a[1]));

        double totalValue = 0;
        int remaining = capacity;

        for (int[] item : items) {
            if (remaining <= 0) break;
            if (item[1] <= remaining) {
                totalValue += item[0];
                remaining -= item[1];
            } else {
                totalValue += (double) item[0] * remaining / item[1];
                remaining = 0;
            }
        }

        return (int)(totalValue * 100);
    }
}
