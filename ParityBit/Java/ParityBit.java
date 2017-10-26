/**
 * A parity bit, or check bit, is a bit added to a string of binary code to ensure that the total number 
 * of 1-bits in the string is even or odd. Parity bits are used as the simplest form of error detecting code.
 * 
 * @author Atom
 * @see <a href="https://en.wikipedia.org/wiki/Parity_bit">Parity bit</a>
 * @see <a href="http://graphics.stanford.edu/~seander/bithacks.html">Bit Twiddling Hacks</a>
 */
public class ParityBit {

	public static int generateEvenParityBit(int data) {
		boolean parityBit = false;
		while (data != 0) {
			parityBit = !parityBit;
			data = data & (data - 1);
		}
		return parityBit ? 1 : 0;
	}
	
	public static int generateOddParityBit(int data) {
		return generateEvenParityBit(data) == 1 ? 0 : 1;
	}
	
	public static int evenParityBit(int data) {
		return (Integer.bitCount(data) % 2 == 0) ? 0 : 1;
	}
	
	public static int oddParityBit(int data) {
		return (Integer.bitCount(data) % 2 == 0) ? 1 : 0;
	}
	
	public static void main(String[] args) {
		for (int i = 0; i < 16; i++) {
			System.out.println("data = " + Integer.toBinaryString(i) + " -> even parity bit = " + (generateEvenParityBit(i) == 1 ? "1" : "0"));
		}
		System.out.println();
		for (int i = 0; i < 16; i++) {
			System.out.println("data = " + Integer.toBinaryString(i) + " -> odd parity bit = " + (generateOddParityBit(i) == 1 ? "1" : "0"));
		}
		System.out.println();
		for (int i = 0; i < 16; i++) {
			System.out.println("data = " + Integer.toBinaryString(i) + " -> even parity bit = " + (evenParityBit(i) == 1 ? "1" : "0"));
		}
		System.out.println();
		for (int i = 0; i < 16; i++) {
			System.out.println("data = " + Integer.toBinaryString(i) + " -> odd parity bit = " + (oddParityBit(i) == 1 ? "1" : "0"));
		}
	}

}

