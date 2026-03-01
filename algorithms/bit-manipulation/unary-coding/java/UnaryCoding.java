/**
 * Unary coding
 * 
 * @author Atom
 *
 */
public class UnaryCoding {

	public static final char UNARY_SYMBOL = '1';
	public static final char END_SYMBOL = '0';
	
	/**
	 * Represents a natural number n by repeating n times an arbitrary symbol followed by another arbitrary symbol.
	 * 
	 * @param x The number to be encoded
	 * @return A string with the coded number
	 */
	public static String unaryCoding(final int x) {
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < x; i++) {
			sb.append(UNARY_SYMBOL);
		}
		sb.append(END_SYMBOL);
		return sb.toString();
	}

	public static void main(String[] args) {
		for (int i = 0; i < 15; i ++) {
			System.out.println(i + ": " + unaryCoding(i));
		}
	}

}
