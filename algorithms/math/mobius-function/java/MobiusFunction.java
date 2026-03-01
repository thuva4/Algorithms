public class MobiusFunction {
    public static int mobiusFunction(int n) {
        if (n <= 0) {
            return 0;
        }

        int[] mu = new int[n + 1];
        int[] primes = new int[n + 1];
        boolean[] isComposite = new boolean[n + 1];
        int primeCount = 0;
        mu[1] = 1;

        for (int i = 2; i <= n; i++) {
            if (!isComposite[i]) {
                primes[primeCount++] = i;
                mu[i] = -1;
            }
            for (int j = 0; j < primeCount; j++) {
                int prime = primes[j];
                long next = (long) i * prime;
                if (next > n) {
                    break;
                }
                isComposite[(int) next] = true;
                if (i % prime == 0) {
                    mu[(int) next] = 0;
                    break;
                }
                mu[(int) next] = -mu[i];
            }
        }

        int sum = 0;
        for (int i = 1; i <= n; i++) {
            sum += mu[i];
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(mobiusFunction(1));
        System.out.println(mobiusFunction(10));
        System.out.println(mobiusFunction(50));
    }
}
