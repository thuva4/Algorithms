class fibonacci {
	static void fibonacci(int n) {
    		int first = 0; // 1st number in sequence
    		int second = 1; // 2nd number in sequence
    		int temp;
    		// start iterating from 3rd number in sequence 
    		for (int i = 3; i <= n; i++) {
			System.out.print(first + " ");
        		// get the next term in sequence by adding the previous two terms together
        		temp = first + second;

        		// set the new first term equal to the previous second term
        		first = second;

        		// set the new second term equal to the newly calculated term
        		second = temp;
    		}
	} 
}
