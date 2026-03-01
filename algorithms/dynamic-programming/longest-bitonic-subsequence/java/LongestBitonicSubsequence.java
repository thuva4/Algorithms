import java.util.Arrays;

public class LongestBitonicSubsequence {

    public static int longestBitonicSubsequence(int[] arr) {
        int n = arr.length;
        if (n == 0) return 0;

        int[] lis = new int[n];
        int[] lds = new int[n];
        Arrays.fill(lis, 1);
        Arrays.fill(lds, 1);

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (arr[j] < arr[i] && lis[j] + 1 > lis[i]) {
                    lis[i] = lis[j] + 1;
                }
            }
        }

        for (int i = n - 2; i >= 0; i--) {
            for (int j = n - 1; j > i; j--) {
                if (arr[j] < arr[i] && lds[j] + 1 > lds[i]) {
                    lds[i] = lds[j] + 1;
                }
            }
        }

        int result = 0;
        for (int i = 0; i < n; i++) {
            result = Math.max(result, lis[i] + lds[i] - 1);
        }

        return result;
    }

    public static void main(String[] args) {
        int[] arr = {1, 3, 4, 2, 6, 1};
        System.out.println(longestBitonicSubsequence(arr)); // 5
    }
}
