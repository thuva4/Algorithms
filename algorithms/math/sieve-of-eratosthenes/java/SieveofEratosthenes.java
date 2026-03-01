public class SieveofEratosthenes {
	public static int[] sieveOfEratosthenes(int n) {
		if (n < 2) {
			return new int[0];
		}

		boolean[] isPrime = new boolean[n + 1];
		java.util.Arrays.fill(isPrime, true);
		isPrime[0] = false;
		isPrime[1] = false;

		for (int i = 2; i * i <= n; i++) {
			if (isPrime[i]) {
				for (int j = i * i; j <= n; j += i) {
					isPrime[j] = false;
				}
			}
		}

		int count = 0;
		for (int i = 2; i <= n; i++) {
			if (isPrime[i]) {
				count++;
			}
		}

		int[] primes = new int[count];
		int index = 0;
		for (int i = 2; i <= n; i++) {
			if (isPrime[i]) {
				primes[index++] = i;
			}
		}
		return primes;
	}
}
