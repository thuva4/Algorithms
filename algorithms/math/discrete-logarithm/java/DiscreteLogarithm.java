import java.util.*;

public class DiscreteLogarithm {
    static long modPow(long base, long exp, long mod) {
        long result = 1;
        base %= mod;
        while (exp > 0) {
            if ((exp & 1) == 1) result = result * base % mod;
            exp >>= 1;
            base = base * base % mod;
        }
        return result;
    }

    public static int discreteLogarithm(long base, long target, long modulus) {
        if (modulus == 1) return 0;
        long normalizedBase = ((base % modulus) + modulus) % modulus;
        long normalizedTarget = ((target % modulus) + modulus) % modulus;
        long current = 1 % modulus;

        for (int exponent = 0; exponent <= modulus; exponent++) {
            if (current == normalizedTarget) {
                return exponent;
            }
            current = (current * normalizedBase) % modulus;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(discreteLogarithm(2, 8, 13));
        System.out.println(discreteLogarithm(5, 1, 7));
        System.out.println(discreteLogarithm(3, 3, 11));
        System.out.println(discreteLogarithm(3, 13, 17));
    }
}
