public class WordBreak {

    /**
     * Determine if target can be formed by summing elements from arr
     * with repetition allowed.
     *
     * @param arr    array of positive integers (available elements)
     * @param target the target sum to reach
     * @return 1 if target is achievable, 0 otherwise
     */
    public static int canSum(int[] arr, int target) {
        if (target == 0) return 1;

        boolean[] dp = new boolean[target + 1];
        dp[0] = true;

        for (int i = 1; i <= target; i++) {
            for (int elem : arr) {
                if (elem <= i && dp[i - elem]) {
                    dp[i] = true;
                    break;
                }
            }
        }

        return dp[target] ? 1 : 0;
    }

    public static void main(String[] args) {
        System.out.println(canSum(new int[]{2, 3}, 7));   // 1
        System.out.println(canSum(new int[]{5, 3}, 8));   // 1
        System.out.println(canSum(new int[]{2, 4}, 7));   // 0
        System.out.println(canSum(new int[]{1}, 5));      // 1
        System.out.println(canSum(new int[]{7}, 3));      // 0
    }
}
