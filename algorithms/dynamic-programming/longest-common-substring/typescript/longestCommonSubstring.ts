/**
 * Find the length of the longest contiguous subarray common to both arrays.
 *
 * @param arr1 - first array of numbers
 * @param arr2 - second array of numbers
 * @returns length of the longest common contiguous subarray
 */
export function longestCommonSubstring(arr1: number[], arr2: number[]): number {
    const n = arr1.length;
    const m = arr2.length;
    let maxLen = 0;

    const dp: number[][] = Array.from({ length: n + 1 }, () =>
        new Array(m + 1).fill(0)
    );

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                if (dp[i][j] > maxLen) {
                    maxLen = dp[i][j];
                }
            } else {
                dp[i][j] = 0;
            }
        }
    }

    return maxLen;
}

console.log(longestCommonSubstring([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]));  // 3
console.log(longestCommonSubstring([1, 2, 3], [4, 5, 6]));                // 0
console.log(longestCommonSubstring([1, 2, 3, 4], [1, 2, 3, 4]));          // 4
console.log(longestCommonSubstring([1], [1]));                             // 1
console.log(longestCommonSubstring([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]));   // 3
