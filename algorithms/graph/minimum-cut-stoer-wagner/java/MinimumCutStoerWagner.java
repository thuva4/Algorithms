public class MinimumCutStoerWagner {

    public static int minimumCutStoerWagner(int[] arr) {
        int n = arr[0];
        int m = arr[1];
        int[][] w = new int[n][n];
        int idx = 2;
        for (int i = 0; i < m; i++) {
            int u = arr[idx]; int v = arr[idx + 1]; int c = arr[idx + 2];
            w[u][v] += c;
            w[v][u] += c;
            idx += 3;
        }

        boolean[] merged = new boolean[n];
        int best = Integer.MAX_VALUE;

        for (int phase = 0; phase < n - 1; phase++) {
            int[] key = new int[n];
            boolean[] inA = new boolean[n];
            int prev = -1, last = -1;

            for (int it = 0; it < n - phase; it++) {
                int sel = -1;
                for (int v = 0; v < n; v++) {
                    if (!merged[v] && !inA[v]) {
                        if (sel == -1 || key[v] > key[sel]) {
                            sel = v;
                        }
                    }
                }
                inA[sel] = true;
                prev = last;
                last = sel;
                for (int v = 0; v < n; v++) {
                    if (!merged[v] && !inA[v]) {
                        key[v] += w[sel][v];
                    }
                }
            }

            if (key[last] < best) {
                best = key[last];
            }

            for (int v = 0; v < n; v++) {
                w[prev][v] += w[last][v];
                w[v][prev] += w[v][last];
            }
            merged[last] = true;
        }

        return best;
    }
}
