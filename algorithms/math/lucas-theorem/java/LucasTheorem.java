public class LucasTheorem {
    static long modPow(long base, long exp, long mod) {
        long result = 1; base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            exp >>= 1;
            base = base * base % mod;
        }
        return result;
    }

    static long combSmall(int a, int b, long[] fact, int p) {
        if (b > a) return 0;
        if (b == 0 || a == b) return 1;
        return fact[a] % p * modPow(fact[b], p - 2, p) % p * modPow(fact[a - b], p - 2, p) % p;
    }

    public static int lucasTheorem(long n, long k, int p) {
        if (k > n) return 0;
        long[] fact = new long[p];
        fact[0] = 1;
        for (int i = 1; i < p; i++) fact[i] = fact[i - 1] * i % p;

        long result = 1;
        while (n > 0 || k > 0) {
            int ni = (int) (n % p), ki = (int) (k % p);
            if (ki > ni) return 0;
            result = result * combSmall(ni, ki, fact, p) % p;
            n /= p; k /= p;
        }
        return (int) result;
    }

    public static void main(String[] args) {
        System.out.println(lucasTheorem(10, 3, 7));
        System.out.println(lucasTheorem(5, 2, 3));
        System.out.println(lucasTheorem(100, 50, 13));
    }
}
