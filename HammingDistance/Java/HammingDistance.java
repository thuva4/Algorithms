/**
 * Calculate the number of positions at which the corresponding symbols are different.
 * 
 * @author Atom
 * @see <a href="https://en.wikipedia.org/wiki/Hamming_distance">Hamming distance</a>
 */
public class HammingDistance {

	public static int hammingDistance(String s1, String s2) {
		if (s1.length() != s2.length()) throw new IllegalArgumentException("The two strings must be the same length.");
		
		int distance = 0;
		for (int i = 0; i < s1.length(); i++) {
			if (s1.charAt(i) != s2.charAt(i)) { distance++; }
		}
		return distance;
	}

	public static int hammingDistanceIgnoreCase(String s1, String s2) {
		return hammingDistance(s1.toLowerCase(), s2.toLowerCase());
	}
	
	public static int hammingDistance(final int x, final int y) {
		return Integer.bitCount(x ^ y);
	}
	
	public static int hammingDistance(final long x, final long y) {
		return Long.bitCount(x ^ y);
	}
	
	public static void main(String[] args) {
		System.out.println(hammingDistance("five", "five"));
		System.out.println(hammingDistance("five", "four"));
		System.out.println(hammingDistance("five", "FIVE"));
		System.out.println(hammingDistanceIgnoreCase("five", "FIVE"));
		System.out.println();
		System.out.println(hammingDistance(1, 1));
		System.out.println(hammingDistance(1, 2));
		System.out.println(hammingDistance(1, 3));
		System.out.println(hammingDistance(1, 4));
		System.out.println(hammingDistance(1, 5));
		System.out.println();
		System.out.println(hammingDistance(1L, 1L));
		System.out.println(hammingDistance(1L, 2L));
		System.out.println(hammingDistance(1L, 3L));
		System.out.println(hammingDistance(1L, 4L));
		System.out.println(hammingDistance(1L, 5L));
	}

}
