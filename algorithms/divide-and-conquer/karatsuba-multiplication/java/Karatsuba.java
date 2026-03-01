public class Karatsuba {

    public static int karatsuba(int[] arr) {
        return (int) multiply(arr[0], arr[1]);
    }

    private static long multiply(long x, long y) {
        if (x < 10 || y < 10) return x * y;

        int n = Math.max(Long.toString(Math.abs(x)).length(), Long.toString(Math.abs(y)).length());
        int half = n / 2;
        long power = (long) Math.pow(10, half);

        long x1 = x / power, x0 = x % power;
        long y1 = y / power, y0 = y % power;

        long z0 = multiply(x0, y0);
        long z2 = multiply(x1, y1);
        long z1 = multiply(x0 + x1, y0 + y1) - z0 - z2;

        return z2 * power * power + z1 * power + z0;
    }
}
