public class RecursiveFibonacci{
    /**
     * Return the nth number of Fibonacci sequence.
     * Exemple: F[0] = 0, F[1] = 1, F[2] = 1, F[3] = 2, F[4] = 3, F[5] = 5...
     */
    public static int recursiveFib(int n){
        if(n == 0){
            return 0;
        }else if(n == 1 || n == 2){
            return 1;
        }else{
            return recursiveFib(n-1) + recursiveFib(n-2);
        }
    }

    public static void main(String[] args){
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 10; i++) {
            System.out.print("F[" + i + "] = " + recursiveFib(i) + "  ");
        }
    }

}