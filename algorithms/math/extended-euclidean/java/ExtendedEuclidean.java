public class ExtendedEuclidean {
    public static int[] extendedGcd(int a, int b) {
        if (a == b) {
            return new int[]{Math.abs(a), 1, 0};
        }
        if (a == 0) {
            return new int[]{Math.abs(b), 0, b >= 0 ? 1 : -1};
        }

        int[] next = extendedGcd(b % a, a);
        int gcd = next[0];
        int x1 = next[1];
        int y1 = next[2];
        int x = y1 - (b / a) * x1;
        int y = x1;
        return new int[]{gcd, x, y};
    }
}
