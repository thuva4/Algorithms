public class PowerOfTwoCheck {

    public static int powerOfTwoCheck(int n) {
        if (n <= 0) return 0;
        return (n & (n - 1)) == 0 ? 1 : 0;
    }
}
