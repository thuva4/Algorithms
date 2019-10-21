// Time Complexity: O(n)

import java.util.*;

class LongestSubsetZeroSum {
    public static void main(String args[]) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter no of elements:");
        int n = sc.nextInt();
        int nums[] = new int[n];
        System.out.println("\nEnter the elements:");
        for (int i = 0; i < n; i++) {
            nums[i] = sc.nextInt();
        }
        
        System.out.println("The longest subset with zero subset is of length " + getLength(nums));
    }

    public static int getLength(int nums[]) {
        int maxLen = 0;
        int currSum = 0;
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            currSum += nums[i];
            
            // if an array element is zero then we set maxLen = 1
            if (nums[i] == 0 && maxLen == 0) {
                maxLen = 1;
            }
            
            // if sum is equal to zero then maxLen will be length of subarray till the
            // current index
            if (currSum == 0) {
                maxLen = i + 1;
            }
            
            // if we found the currSum previously in the array then the sum of elements between
            // the index at which currSum was encountered and the current index is zero
            // else if the sum is not found then we map the currSum to current index
            Integer prevSum = map.get(currSum);
            
            if (prevSum != null) {
                maxLen = Math.max(maxLen, i - prevSum);
            } else {
                map.put(currSum, i);
            }
        }
        return maxLen;
    }
}
