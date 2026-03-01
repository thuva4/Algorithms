public class EggDrop {

    public static int eggDrop(int[] arr) {
        int eggs = arr[0], floors = arr[1];
        int[][] dp = new int[eggs + 1][floors + 1];
        for (int f = 1; f <= floors; f++) dp[1][f] = f;
        for (int e = 2; e <= eggs; e++) {
            for (int f = 1; f <= floors; f++) {
                dp[e][f] = Integer.MAX_VALUE;
                for (int x = 1; x <= f; x++) {
                    int worst = 1 + Math.max(dp[e - 1][x - 1], dp[e][f - x]);
                    dp[e][f] = Math.min(dp[e][f], worst);
                }
            }
        }
        return dp[eggs][floors];
    }
}
