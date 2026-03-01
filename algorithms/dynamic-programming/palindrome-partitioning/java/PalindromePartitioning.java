public class PalindromePartitioning {

    public static int palindromePartitioning(int[] arr) {
        int n = arr.length;
        if (n <= 1) return 0;

        boolean[][] isPal = new boolean[n][n];
        for (int i = 0; i < n; i++) isPal[i][i] = true;
        for (int i = 0; i < n - 1; i++) isPal[i][i + 1] = (arr[i] == arr[i + 1]);
        for (int len = 3; len <= n; len++)
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                isPal[i][j] = (arr[i] == arr[j]) && isPal[i + 1][j - 1];
            }

        int[] cuts = new int[n];
        for (int i = 0; i < n; i++) {
            if (isPal[0][i]) { cuts[i] = 0; continue; }
            cuts[i] = i;
            for (int j = 1; j <= i; j++)
                if (isPal[j][i] && cuts[j - 1] + 1 < cuts[i])
                    cuts[i] = cuts[j - 1] + 1;
        }
        return cuts[n - 1];
    }

    public static void main(String[] args) {
        System.out.println(palindromePartitioning(new int[]{1, 2, 1}));
        System.out.println(palindromePartitioning(new int[]{1, 2, 3, 2}));
        System.out.println(palindromePartitioning(new int[]{1, 2, 3}));
        System.out.println(palindromePartitioning(new int[]{5}));
    }
}
