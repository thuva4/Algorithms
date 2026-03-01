export function longestSubsetZeroSum(arr: number[]): number {
    let maxLen = 0;
    const sumMap = new Map<number, number>();
    sumMap.set(0, -1);
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (sumMap.has(sum)) {
            const length = i - sumMap.get(sum)!;
            maxLen = Math.max(maxLen, length);
        } else {
            sumMap.set(sum, i);
        }
    }

    return maxLen;
}

console.log(longestSubsetZeroSum([1, 2, -3, 3])); // 3
