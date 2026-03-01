export function wildcardMatching(arr: number[]): number {
    let idx = 0;
    const tlen = arr[idx++];
    const text = arr.slice(idx, idx + tlen); idx += tlen;
    const plen = arr[idx++];
    const pattern = arr.slice(idx, idx + plen);

    const dp: boolean[][] = Array.from({ length: tlen + 1 }, () => new Array(plen + 1).fill(false));
    dp[0][0] = true;
    for (let j = 1; j <= plen; j++)
        if (pattern[j-1] === 0) dp[0][j] = dp[0][j-1];

    for (let i = 1; i <= tlen; i++)
        for (let j = 1; j <= plen; j++) {
            if (pattern[j-1] === 0) dp[i][j] = dp[i-1][j] || dp[i][j-1];
            else if (pattern[j-1] === -1 || pattern[j-1] === text[i-1]) dp[i][j] = dp[i-1][j-1];
        }

    return dp[tlen][plen] ? 1 : 0;
}

console.log(wildcardMatching([3, 1, 2, 3, 3, 1, 2, 3]));
console.log(wildcardMatching([3, 1, 2, 3, 1, 0]));
console.log(wildcardMatching([3, 1, 2, 3, 3, 1, -1, 3]));
console.log(wildcardMatching([2, 1, 2, 2, 3, 4]));
console.log(wildcardMatching([0, 1, 0]));
