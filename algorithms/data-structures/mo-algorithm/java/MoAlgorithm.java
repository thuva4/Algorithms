import java.util.*;

public class MoAlgorithm {

    public static long[] moAlgorithm(int n, int[] arr, int[][] queries) {
        int q = queries.length;
        int block = Math.max(1, (int) Math.sqrt(n));
        Integer[] order = new Integer[q];
        for (int i = 0; i < q; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> {
            int ba = queries[a][0] / block, bb = queries[b][0] / block;
            if (ba != bb) return ba - bb;
            return (ba % 2 == 0) ? queries[a][1] - queries[b][1] : queries[b][1] - queries[a][1];
        });

        long[] results = new long[q];
        int curL = 0, curR = -1;
        long curSum = 0;

        for (int idx : order) {
            int l = queries[idx][0], r = queries[idx][1];
            while (curR < r) curSum += arr[++curR];
            while (curL > l) curSum += arr[--curL];
            while (curR > r) curSum -= arr[curR--];
            while (curL < l) curSum -= arr[curL++];
            results[idx] = curSum;
        }
        return results;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
        int q = sc.nextInt();
        int[][] queries = new int[q][2];
        for (int i = 0; i < q; i++) { queries[i][0] = sc.nextInt(); queries[i][1] = sc.nextInt(); }
        long[] results = moAlgorithm(n, arr, queries);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < q; i++) { if (i > 0) sb.append(' '); sb.append(results[i]); }
        System.out.println(sb);
    }
}
