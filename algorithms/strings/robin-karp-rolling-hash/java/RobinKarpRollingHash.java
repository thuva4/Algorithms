public class RobinKarpRollingHash {

    public static int robinKarpRollingHash(int[] arr) {
        int idx = 0;
        int tlen = arr[idx++];
        int[] text = new int[tlen];
        for (int i = 0; i < tlen; i++) text[i] = arr[idx++];
        int plen = arr[idx++];
        int[] pattern = new int[plen];
        for (int i = 0; i < plen; i++) pattern[i] = arr[idx++];

        if (plen > tlen) return -1;
        long BASE = 31, MOD = 1000000007;
        long pHash = 0, tHash = 0, power = 1;

        for (int i = 0; i < plen; i++) {
            pHash = (pHash + (pattern[i] + 1) * power) % MOD;
            tHash = (tHash + (text[i] + 1) * power) % MOD;
            if (i < plen - 1) power = (power * BASE) % MOD;
        }

        for (int i = 0; i <= tlen - plen; i++) {
            if (tHash == pHash) {
                boolean match = true;
                for (int j = 0; j < plen; j++)
                    if (text[i+j] != pattern[j]) { match = false; break; }
                if (match) return i;
            }
            if (i < tlen - plen) {
                tHash = (tHash - (text[i] + 1) + MOD) % MOD;
                tHash = tHash * modInverse(BASE, MOD) % MOD;
                tHash = (tHash + (text[i + plen] + 1) * power) % MOD;
            }
        }
        return -1;
    }

    static long modInverse(long a, long mod) {
        return modPow(a, mod - 2, mod);
    }

    static long modPow(long base, long exp, long mod) {
        long result = 1; base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            exp >>= 1; base = base * base % mod;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(robinKarpRollingHash(new int[]{5, 1, 2, 3, 4, 5, 2, 1, 2}));
        System.out.println(robinKarpRollingHash(new int[]{5, 1, 2, 3, 4, 5, 2, 3, 4}));
        System.out.println(robinKarpRollingHash(new int[]{4, 1, 2, 3, 4, 2, 5, 6}));
        System.out.println(robinKarpRollingHash(new int[]{4, 1, 2, 3, 4, 1, 4}));
    }
}
