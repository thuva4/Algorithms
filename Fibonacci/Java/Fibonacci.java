class Fibonacci
{
	public static void main(String[] args) {
		
		int n = Integer.parseInt(args[0]);
		System.out.println(fib(n));
	}

	//method for getting nth fibonacci number using recursion
	public static int fib(int n)
	{
		if(n==1)
			return 0;
		if(n==2)
			return 1;
		else 
			return fib(n-1)+fib(n-2);
	}
}
