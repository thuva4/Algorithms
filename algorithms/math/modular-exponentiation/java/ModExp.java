public class ModExp {

    public static int modExp(int[] arr) {
        long base = arr[0];
        long exp = arr[1];
        long mod = arr[2];
        if (mod == 1) return 0;
        long result = 1;
        base = base % mod;
        while (exp > 0) {
            if (exp % 2 == 1) {
                result = (result * base) % mod;
            }
            exp >>= 1;
            base = (base * base) % mod;
        }
        return (int) result;
    }
}
