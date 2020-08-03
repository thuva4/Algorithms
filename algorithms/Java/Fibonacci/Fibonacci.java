
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

	public static void fibonacciRecursionv1(int count, int a, int b) {
		if (count > 0) {
			int c = a + b;
			a = b;
			b = c;
			System.out.printf("%d ", c);
			fibonacciRecursionv1(count - 1, a, b);
		}
	}

	public static int fibonacciRecursionv2(int i){
		if(i==1 || i==2){
			return 1;
		}
		else if (i == 0){
			return 0;
		}
		return fibonacciRecursionv2(i-2)+fibonacciRecursionv2(i-1);
	}
}
