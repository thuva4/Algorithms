
public class Fibonacci {
	public static void main(String[] args) {
		int num, num1 = 0, num2 = 1, temp;
		num = Integer.parseInt(args[0]);
		System.out.print("Fibonacci numbers: ");
		for (int i = 1; i <= num; i++) {
			// This prints fibonacci number;
			System.out.print(num1 + " ");
			// This calculates fibonacci number;
			temp = num1 + num2;
			num1 = num2;
			num2 = temp;
		}

	}
}
