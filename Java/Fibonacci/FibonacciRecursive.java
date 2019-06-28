class FibonacciRecursive {
	public static int fibo(int i){
		if(i==0 || i==1){
			return 1;
		}
		//System.out.println("inside fibo");
		return fibo(i-2)+fibo(i-1);
	} 
	public static void main(String[] args){
		//System.out.println("test");
		System.out.println(fibo(4));
	}
}