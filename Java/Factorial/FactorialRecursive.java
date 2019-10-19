import java.io.BufferedReader;
import java.util.Scanner; 

// A class to find the factorial of an integer.
public class FactorialRecursive {
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in); 
		
		System.out.print("Enter an integer to find its factorial: ");
		long n = in.nextLong();
		if (n < 0) {
			System.out.println("Factorial of negative numbers isn't defined");
		} else {
			long f = factorial(n);
			System.out.println("Factorial of " + n + " is " + f);
		}
	}


	// Recursive function which returns factorial of a number.
	static long factorial(long n) {
		return (n == 0 ? 1 : n * factorial(n - 1));
	}
}
