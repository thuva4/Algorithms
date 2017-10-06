class GCD {
    public static int gcd(int a, int b) {
        int temp, remainder;
        // The larger value will always be assigned to the int a.
        if (b > a) {
            temp = a;
            a = b;
            b = a;
        }
        while (b != 0) {
            remainder = a % b;
            a = b;
            b = remainder;
        }
        return a;
    }
}