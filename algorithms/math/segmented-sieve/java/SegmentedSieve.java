import java.util.ArrayList;
import java.util.List;

public class SegmentedSieve {
    public static int[] segmentedSieve(int low, int high) {
        if (high < 2 || high < low) {
            return new int[0];
        }
        low = Math.max(low, 2);

        int limit = (int) Math.sqrt(high);
        boolean[] prime = new boolean[limit + 1];
        java.util.Arrays.fill(prime, true);
        prime[0] = false;
        if (limit >= 1) {
            prime[1] = false;
        }

        List<Integer> basePrimes = new ArrayList<>();
        for (int p = 2; p <= limit; p++) {
            if (prime[p]) {
                basePrimes.add(p);
                for (int multiple = p * p; multiple <= limit; multiple += p) {
                    prime[multiple] = false;
                }
            }
        }

        boolean[] mark = new boolean[high - low + 1];
        java.util.Arrays.fill(mark, true);
        for (int p : basePrimes) {
            int start = Math.max(p * p, ((low + p - 1) / p) * p);
            for (int value = start; value <= high; value += p) {
                mark[value - low] = false;
            }
        }

        int count = 0;
        for (boolean isPrime : mark) {
            if (isPrime) {
                count++;
            }
        }

        int[] result = new int[count];
        int index = 0;
        for (int i = 0; i < mark.length; i++) {
            if (mark[i]) {
                result[index++] = low + i;
            }
        }
        return result;
    }
}
