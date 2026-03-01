/**
 * Determine if target can be formed by summing elements from arr
 * with repetition allowed.
 *
 * @param arr - array of positive integers (available elements)
 * @param target - the target sum to reach
 * @returns 1 if target is achievable, 0 otherwise
 */
export function canSum(arr: number[], target: number): number {
    if (target === 0) return 1;

    const dp: boolean[] = new Array(target + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= target; i++) {
        for (const elem of arr) {
            if (elem <= i && dp[i - elem]) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[target] ? 1 : 0;
}

console.log(canSum([2, 3], 7));   // 1
console.log(canSum([5, 3], 8));   // 1
console.log(canSum([2, 4], 7));   // 0
console.log(canSum([1], 5));      // 1
console.log(canSum([7], 3));      // 0
