import java.util.Scanner; 

/* 
        Iterative function to find the factorial of a number 
        Time Complexity : O(N) 
        Space Complexity : O(1) 
*/
public class FactorialIterative {
        public static void main(String[] args) {
                Scanner in = new Scanner(System.in); 
                System.out.print("Enter the number whose factorial you want to find : "); 
                long n = in.nextLong(); 
                if (n < 0) {
                        System.out.println("Factorial of a negative number is not defined"); 
                } else {
                        long f = factorial(n); 
                        System.out.println("Factorial of " + n + " is : " + f);         
                }
        }

        // Iterative function to find the factorial of a number
        static long factorial(long n) {
                long prod = 1L; 
                for (long i = 2; i <= n; i++) {
                        prod *= i; 
                }
                return prod;
        }
}
