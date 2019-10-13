// Java Factorial function using recursion

import java.util.Scanner;

public class Factorial {
	public static void main(String[] args) {
		// Scanner for capturing user input
		Scanner scanner = new Scanner(System.in);
	
		System.out.println("Enter the number: ");

		while (scanner.hasNext()) {
			int input = scanner.nextInt();
			int result = factorial(input);

			System.out.println("Factorial of " + input + " is " + result);
		}
		scanner.close();	
	}

	static int factorial(int n) {
		if (n == 1 || n == 0) {
			return 1;
		}
		return n * factorial(n-1);
	}
}

//Enter the number:
//0
//Factorial of 0 is 1
//Enter the number:
//1
//Factorial of 1 is 1
//Enter the number:
//2
//Factorial of 2 is 2
//Enter the number:
//3
//Factorial of 3 is 6
//Enter the number:
//4
//Factorial of 4 is 24
//Enter the number:
//5
//Factorial of 5 is 120
//Enter the number:
//10
//Factorial of 10 is 3628800
