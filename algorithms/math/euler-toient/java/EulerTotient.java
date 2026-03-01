public class EulerTotient {
    public static int eulerTotient(int n) {
        if (n <= 0) {
            return 0;
        }
        if (n == 1) {
            return 1;
        }

        int result = n;
        int value = n;
        for (int factor = 2; factor * factor <= value; factor++) {
            if (value % factor == 0) {
                while (value % factor == 0) {
                    value /= factor;
                }
                result -= result / factor;
            }
        }
        if (value > 1) {
            result -= result / value;
        }
        return result;
    }
}
