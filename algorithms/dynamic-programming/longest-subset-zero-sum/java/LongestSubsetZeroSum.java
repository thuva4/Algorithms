import java.util.HashMap;

public class LongestSubsetZeroSum {

    public static int longestSubsetZeroSum(int[] arr) {
        int n = arr.length;
        int maxLen = 0;

        HashMap<Integer, Integer> sumMap = new HashMap<>();
        sumMap.put(0, -1);
        int sum = 0;

        for (int i = 0; i < n; i++) {
            sum += arr[i];
            if (sumMap.containsKey(sum)) {
                int length = i - sumMap.get(sum);
                maxLen = Math.max(maxLen, length);
            } else {
                sumMap.put(sum, i);
            }
        }

        return maxLen;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, -3, 3};
        System.out.println(longestSubsetZeroSum(arr)); // 3
    }
}
