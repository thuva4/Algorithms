public class PrimeCheck {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;

        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("2 is prime: " + isPrime(2));
        System.out.println("4 is prime: " + isPrime(4));
        System.out.println("97 is prime: " + isPrime(97));
        System.out.println("100 is prime: " + isPrime(100));
    }
}
