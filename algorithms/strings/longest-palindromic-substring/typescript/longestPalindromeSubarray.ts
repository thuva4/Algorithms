export function longestPalindromeSubarray(arr: number[]): number {
    const n = arr.length;
    if (n === 0) return 0;

    function expand(l: number, r: number): number {
        while (l >= 0 && r < n && arr[l] === arr[r]) { l--; r++; }
        return r - l - 1;
    }

    let maxLen = 1;
    for (let i = 0; i < n; i++) {
        const odd = expand(i, i);
        const even = expand(i, i + 1);
        maxLen = Math.max(maxLen, odd, even);
    }
    return maxLen;
}
