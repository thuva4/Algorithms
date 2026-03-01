public class PrimalityTests {
    public static boolean isPrime(int n) {
        if (n < 2) {
            return false;
        }
        if (n == 2 || n == 3) {
            return true;
        }
        if (n % 2 == 0 || n % 3 == 0) {
            return false;
        }
        for (int factor = 5; factor * factor <= n; factor += 6) {
            if (n % factor == 0 || n % (factor + 2) == 0) {
                return false;
            }
        }
        return true;
    }
}
