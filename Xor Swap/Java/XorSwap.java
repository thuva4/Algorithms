/**
 * XOR swap is an algorithm that uses the XOR bitwise operation to swap 
 * values of distinct variables without using a temporary variable. 
 * 
 * @author Atom
 * @see <a href="https://en.wikipedia.org/wiki/XOR_swap_algorithm">XOR swap</a>
 */
public class XorSwap {
	
	public static void main(String[] args) {
		for (int i = -1, j = 3; i <= 3; i++, j--) {
			int x = i;
			int y = j;
			System.out.print("x = " + x + ", y = " + y);
			
			// Xor swap. Swap values without using a temporary variable
			if (x != y) {
				x ^= y;
				y ^= x;
				x ^= y;				
			}
			
			System.out.println(", swap(x, y) -> x = " + x + ", y = " + y);
		}
	}

}
