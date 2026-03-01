public class Combination {
    public static int nCr(int n, int r) {
        if (r < 0 || r > n) {
            return 0;
        }
        if (r == 0 || r == n) {
            return 1;
        }
        int k = Math.min(r, n - r);
        long result = 1;
        for (int i = 1; i <= k; i++) {
            result = result * (n - k + i) / i;
        }
        return (int) result;
    }
}
