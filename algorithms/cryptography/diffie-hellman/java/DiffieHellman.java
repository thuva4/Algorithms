import java.math.BigInteger;

public class DiffieHellman {
    public static long modPow(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1)
                result = (result * base) % mod;
            exp >>= 1;
            base = (base * base) % mod;
        }
        return result;
    }

    public static void main(String[] args) {
        long p = 23;    // publicly shared prime
        long g = 5;     // publicly shared base

        long a = 6;     // Alice's secret
        long b = 15;    // Bob's secret

        long A = modPow(g, a, p);
        System.out.println("Alice sends: " + A);

        long B = modPow(g, b, p);
        System.out.println("Bob sends: " + B);

        long aliceSecret = modPow(B, a, p);
        System.out.println("Alice's shared secret: " + aliceSecret);

        long bobSecret = modPow(A, b, p);
        System.out.println("Bob's shared secret: " + bobSecret);
    }
}
