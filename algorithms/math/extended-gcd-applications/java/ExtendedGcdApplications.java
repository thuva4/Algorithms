public class ExtendedGcdApplications {

    static long[] extGcd(long a, long b) {
        if (a == 0) return new long[]{b, 0, 1};
        long[] r = extGcd(b % a, a);
        return new long[]{r[0], r[2] - (b / a) * r[1], r[1]};
    }

    public static int extendedGcdApplications(int[] arr) {
        long a = arr[0], m = arr[1];
        long[] r = extGcd(((a % m) + m) % m, m);
        if (r[0] != 1) return -1;
        return (int)(((r[1] % m) + m) % m);
    }

    public static void main(String[] args) {
        System.out.println(extendedGcdApplications(new int[]{3, 7}));
        System.out.println(extendedGcdApplications(new int[]{1, 13}));
        System.out.println(extendedGcdApplications(new int[]{6, 9}));
        System.out.println(extendedGcdApplications(new int[]{2, 11}));
    }
}
