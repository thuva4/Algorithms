export function maxSubarrayDC(arr: number[]): number {
    if (arr.length === 0) return 0;

    function helper(lo: number, hi: number): number {
        if (lo === hi) return arr[lo];
        const mid = (lo + hi) >> 1;

        let leftSum = -Infinity, s = 0;
        for (let i = mid; i >= lo; i--) { s += arr[i]; leftSum = Math.max(leftSum, s); }
        let rightSum = -Infinity; s = 0;
        for (let i = mid + 1; i <= hi; i++) { s += arr[i]; rightSum = Math.max(rightSum, s); }

        const cross = leftSum + rightSum;
        const leftMax = helper(lo, mid);
        const rightMax = helper(mid + 1, hi);
        return Math.max(leftMax, rightMax, cross);
    }
    return helper(0, arr.length - 1);
}
