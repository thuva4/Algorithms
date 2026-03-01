public class CatalanNumbers {

    private static final long MOD = 1000000007;

    public static int catalanNumbers(int n) {
        long result = 1;
        for (int i = 1; i <= n; i++) {
            result = result * (2 * (2 * i - 1)) % MOD;
            result = result * modInv(i + 1, MOD) % MOD;
        }
        return (int) result;
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

    private static long modInv(long a, long mod) {
        return modPow(a, mod - 2, mod);
    }
}
