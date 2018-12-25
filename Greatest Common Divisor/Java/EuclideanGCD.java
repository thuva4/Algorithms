/**
 * Calculates the greatest common divisor of two natural numbers.
 * 
 * @author Atom
 *
 */
public class EuclideanGCD {

	/**
	 * Calculates the greatest common divisor of two natural numbers using the Euclidean algorithm.
	 * 
	 * @param a natural number
	 * @param b natural number
	 * @return the largest natural number that divides a and b without leaving a remainder
	 */
	public static int gcd(int a, int b) {
		while (b != 0) {
			int temp = b;
			b = a % b;
			a = temp;
		}
		return a;
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
