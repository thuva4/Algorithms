import java.math.BigInteger;

public class RsaAlgorithm {
    public static long rsaAlgorithm(long p, long q, long e, long message) {
        long n = p * q;
        long phi = (p - 1) * (q - 1);

        BigInteger bE = BigInteger.valueOf(e);
        BigInteger bPhi = BigInteger.valueOf(phi);
        BigInteger bN = BigInteger.valueOf(n);
        BigInteger d = bE.modInverse(bPhi);

        BigInteger cipher = BigInteger.valueOf(message).modPow(bE, bN);
        BigInteger plain = cipher.modPow(d, bN);
        return plain.longValue();
    }

    public static void main(String[] args) {
        System.out.println(rsaAlgorithm(61, 53, 17, 65));
        System.out.println(rsaAlgorithm(61, 53, 17, 42));
        System.out.println(rsaAlgorithm(11, 13, 7, 9));
    }
}
