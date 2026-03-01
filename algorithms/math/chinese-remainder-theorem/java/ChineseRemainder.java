public class ChineseRemainder {

    public static int chineseRemainder(int[] arr) {
        int n = arr[0];
        long r = arr[1];
        long m = arr[2];

        for (int i = 1; i < n; i++) {
            long r2 = arr[1 + 2 * i];
            long m2 = arr[2 + 2 * i];
            long[] gcd = extGcd(m, m2);
            long g = gcd[0], p = gcd[1];
            long lcm = m / g * m2;
            r = (r + m * ((r2 - r) / g % (m2 / g)) * p) % lcm;
            if (r < 0) r += lcm;
            m = lcm;
        }

        return (int) (r % m);
    }

    private static long[] extGcd(long a, long b) {
        if (a == 0) return new long[]{b, 0, 1};
        long[] res = extGcd(b % a, a);
        return new long[]{res[0], res[2] - (b / a) * res[1], res[1]};
    }
}
