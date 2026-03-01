import java.util.*;

public class Ntt {
    static final long MOD = 998244353;
    static final long G = 3;

    static long modPow(long base, long exp, long mod) {
        long result = 1; base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            exp >>= 1;
            base = base * base % mod;
        }
        return result;
    }

    static void nttTransform(long[] a, boolean invert) {
        int n = a.length;
        for (int i = 1, j = 0; i < n; i++) {
            int bit = n >> 1;
            for (; (j & bit) != 0; bit >>= 1) j ^= bit;
            j ^= bit;
            if (i < j) { long t = a[i]; a[i] = a[j]; a[j] = t; }
        }
        for (int len = 2; len <= n; len <<= 1) {
            long w = modPow(G, (MOD - 1) / len, MOD);
            if (invert) w = modPow(w, MOD - 2, MOD);
            int half = len / 2;
            for (int i = 0; i < n; i += len) {
                long wn = 1;
                for (int k = 0; k < half; k++) {
                    long u = a[i + k], v = a[i + k + half] * wn % MOD;
                    a[i + k] = (u + v) % MOD;
                    a[i + k + half] = (u - v + MOD) % MOD;
                    wn = wn * w % MOD;
                }
            }
        }
        if (invert) {
            long invN = modPow(n, MOD - 2, MOD);
            for (int i = 0; i < n; i++) a[i] = a[i] * invN % MOD;
        }
    }

    public static int[] ntt(int[] data) {
        int idx = 0;
        int na = data[idx++];
        long[] a = new long[na];
        for (int i = 0; i < na; i++) a[i] = ((long) data[idx++] % MOD + MOD) % MOD;
        int nb = data[idx++];
        long[] b = new long[nb];
        for (int i = 0; i < nb; i++) b[i] = ((long) data[idx++] % MOD + MOD) % MOD;

        int resultLen = na + nb - 1;
        int n = 1;
        while (n < resultLen) n <<= 1;

        long[] fa = new long[n], fb = new long[n];
        System.arraycopy(a, 0, fa, 0, na);
        System.arraycopy(b, 0, fb, 0, nb);

        nttTransform(fa, false);
        nttTransform(fb, false);
        for (int i = 0; i < n; i++) fa[i] = fa[i] * fb[i] % MOD;
        nttTransform(fa, true);

        int[] result = new int[resultLen];
        for (int i = 0; i < resultLen; i++) result[i] = (int) fa[i];
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(ntt(new int[]{2, 1, 2, 2, 3, 4})));
        System.out.println(Arrays.toString(ntt(new int[]{2, 1, 1, 2, 1, 1})));
    }
}
