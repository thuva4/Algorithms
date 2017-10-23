/**
 * The binary GCD algorithm, also known as Stein's algorithm, is an algorithm 
 * that computes the greatest common divisor of two nonnegative integers.
 * 
 * @author Atom
 * @see <a href="https://en.wikipedia.org/wiki/Binary_GCD_algorithm">Binary GCD algorithm</a>
 * @see <a href="http://www.geeksforgeeks.org/steins-algorithm-for-finding-gcd/">Stein’s Algorithm for finding GCD</a>
 */
public class BinaryGCD {

	/**
	 * Stein's algorithm uses simpler arithmetic operations than the conventional Euclidean algorithm,
	 * replaces division with arithmetic shifts, comparisons, and subtraction
	 * 
	 * @param a
	 * @param b
	 * @return
	 */
	public static int gcd(int a, int b) {
		// gcd(0,b) == b; gcd(a,0) == a, gcd(0,0) == 0
		if (a == 0) { return b; }
		if (b == 0) { return a; }
		
		// find the greatest power of 2 dividing both 'a' and 'b'
		int shift;
		for (shift = 0; ((a | b) & 1) == 0; shift++) {
			a >>>= 1;
			b >>>= 1;
		}
		
		// divide 'a' by 2 until 'a' becomes odd
		while ((a & 1) == 0) { a >>>= 1; }
		
		// from here on, 'a' is always odd
		while (b != 0) {
			// remove all factor of 2 in 'b'
			while ((b & 1) == 0) { b >>>= 1; }
			// Now 'a' and 'b' are both odd. If 'a' > 'b' swap, substract 'a' from 'b'
			if (a > b) {
				int tmp = a;
				a = b;
				b = tmp;
			}
			b -= a;
		}
		// restore common factors of 2
		return a << shift;		
	}
	
	public static void main(String[] args) {
		System.out.println(gcd(10, 5));
		System.out.println(gcd(5, 10));
		System.out.println(gcd(10, 8));
		System.out.println(gcd(8, 2));
		System.out.println(gcd(7000, 2000));
		System.out.println(gcd(2000, 7000));
		System.out.println(gcd(10, 11));
		System.out.println(gcd(11, 7));
		System.out.println(gcd(239, 293));
	}

}

