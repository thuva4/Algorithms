import java.util.Scanner;

public class DigitDp {
    static int[] digits;
    static int targetSum;
    static int numDigits;
    static int[][][] memo;

    public static int digitDp(int n, int target) {
        if (n <= 0 || target <= 0) return 0;

        targetSum = target;
        String s = Integer.toString(n);
        numDigits = s.length();
        digits = new int[numDigits];
        for (int i = 0; i < numDigits; i++) {
            digits[i] = s.charAt(i) - '0';
        }

        int maxSum = 9 * numDigits;
        if (target > maxSum) return 0;

        memo = new int[numDigits][maxSum + 1][2];
        for (int[][] a : memo)
            for (int[] b : a)
                java.util.Arrays.fill(b, -1);

        return solve(0, 0, 1);
    }

    private static int solve(int pos, int currentSum, int tight) {
        if (currentSum > targetSum) return 0;
        if (pos == numDigits) {
            return currentSum == targetSum ? 1 : 0;
        }

        if (memo[pos][currentSum][tight] != -1) {
            return memo[pos][currentSum][tight];
        }

        int limit = tight == 1 ? digits[pos] : 9;
        int result = 0;
        for (int d = 0; d <= limit; d++) {
            result += solve(pos + 1, currentSum + d, (tight == 1 && d == limit) ? 1 : 0);
        }

        memo[pos][currentSum][tight] = result;
        return result;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int target = sc.nextInt();
        System.out.println(digitDp(n, target));
    }
}
