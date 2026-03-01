export function palindromePartitioning(arr: number[]): number {
    const n = arr.length;
    if (n <= 1) return 0;

    const isPal: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    for (let i = 0; i < n; i++) isPal[i][i] = true;
    for (let i = 0; i < n - 1; i++) isPal[i][i+1] = arr[i] === arr[i+1];
    for (let len = 3; len <= n; len++)
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            isPal[i][j] = arr[i] === arr[j] && isPal[i+1][j-1];
        }

    const cuts = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        if (isPal[0][i]) { cuts[i] = 0; continue; }
        cuts[i] = i;
        for (let j = 1; j <= i; j++)
            if (isPal[j][i] && cuts[j-1] + 1 < cuts[i]) cuts[i] = cuts[j-1] + 1;
    }
    return cuts[n-1];
}

console.log(palindromePartitioning([1, 2, 1]));
console.log(palindromePartitioning([1, 2, 3, 2]));
console.log(palindromePartitioning([1, 2, 3]));
console.log(palindromePartitioning([5]));
