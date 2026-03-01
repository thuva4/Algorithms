export function longestPalindromeLength(arr: number[]): number {
    if (arr.length === 0) return 0;

    const t: number[] = [-1];
    for (const x of arr) {
        t.push(x, -1);
    }

    const n = t.length;
    const p = new Array(n).fill(0);
    let c = 0, r = 0, maxLen = 0;

    for (let i = 0; i < n; i++) {
        const mirror = 2 * c - i;
        if (i < r) {
            p[i] = Math.min(r - i, p[mirror]);
        }
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] === t[i - p[i] - 1]) {
            p[i]++;
        }
        if (i + p[i] > r) { c = i; r = i + p[i]; }
        if (p[i] > maxLen) maxLen = p[i];
    }

    return maxLen;
}
