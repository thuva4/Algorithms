public class MillerRabin {

    public static int millerRabin(int n) {
        if (n < 2) return 0;
        if (n < 4) return 1;
        if (n % 2 == 0) return 0;

        int r = 0;
        long d = n - 1;
        while (d % 2 == 0) {
            r++;
            d /= 2;
        }

        int[] witnesses = {2, 3, 5, 7};
        for (int a : witnesses) {
            if (a >= n) continue;

            long x = modPow(a, d, n);
            if (x == 1 || x == n - 1) continue;

            boolean found = false;
            for (int i = 0; i < r - 1; i++) {
                x = modPow(x, 2, n);
                if (x == n - 1) {
                    found = true;
                    break;
                }
            }

            if (!found) return 0;
        }

        return 1;
    }

    private static long modPow(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if (exp % 2 == 1) result = result * base % mod;
            exp /= 2;
            base = base * base % mod;
        }
        return result;
    }
}
