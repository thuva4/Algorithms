public class SieveofEratosthenes {
	/* Algorithm to calculate all the prime numbers that are smaller than or equal to n */
	static void SieveofEratosthenes(int n) {
		// create array to store whether each number is prime or not
		boolean isPrime[] = new boolean[n+1];

		// excluding 0 and 1, initialise every element in the array to true 
		for (int i = 2; i < n; i++) {
			isPrime[i] = true;
		}
		
		// if a number can be made as a product of two other numbers it is not prime
		for (int i = 2; i * i <= n; i++) {
			if (isPrime[i] == true) {
				for (int j = i * i; j <= n; j += i) {
					isPrime[j] = false;
				}
			}
		}

		// Print all prime numbers
        	for(int i = 0; i <= n; i++) {
            		if(isPrime[i] == true)
                		System.out.print(i + " ");
        	}
		System.out.println("");
	}
}
