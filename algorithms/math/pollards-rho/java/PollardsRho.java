public class PollardsRho {
    static boolean isPrime(long n) {
        if (n < 2) return false;
        if (n < 4) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (long i = 5; i * i <= n; i += 6)
            if (n % i == 0 || n % (i + 2) == 0) return false;
        return true;
    }

    static long gcd(long a, long b) {
        while (b != 0) { long t = b; b = a % b; a = t; }
        return a;
    }

    static long rho(long n) {
        if (n % 2 == 0) return 2;
        long x = 2, y = 2, c = 1, d = 1;
        while (d == 1) {
            x = (x * x + c) % n;
            y = (y * y + c) % n;
            y = (y * y + c) % n;
            d = gcd(Math.abs(x - y), n);
        }
        return d != n ? d : n;
    }

    static long smallestPrimeFactor(long n) {
        if (n <= 1) return n;
        if (isPrime(n)) return n;
        long smallest = n;
        java.util.Stack<Long> stack = new java.util.Stack<>();
        stack.push(n);
        while (!stack.isEmpty()) {
            long num = stack.pop();
            if (num <= 1) continue;
            if (isPrime(num)) { smallest = Math.min(smallest, num); continue; }
            long d = rho(num);
            if (d == num) {
                for (long c = 2; c < 20; c++) {
                    long xx = 2, yy = 2;
                    d = 1;
                    while (d == 1) {
                        xx = (xx * xx + c) % num;
                        yy = (yy * yy + c) % num;
                        yy = (yy * yy + c) % num;
                        d = gcd(Math.abs(xx - yy), num);
                    }
                    if (d != num) break;
                }
            }
            stack.push(d);
            stack.push(num / d);
        }
        return smallest;
    }

    public static long pollardsRho(long n) {
        return smallestPrimeFactor(n);
    }

    public static void main(String[] args) {
        System.out.println(pollardsRho(15));
        System.out.println(pollardsRho(13));
        System.out.println(pollardsRho(91));
        System.out.println(pollardsRho(221));
    }
}
