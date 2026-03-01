/**
 * Compute the Levenshtein (edit) distance between two sequences.
 *
 * Input format: [len1, seq1..., len2, seq2...]
 * @param arr - input array encoding two sequences
 * @returns minimum number of single-element edits
 */
export function levenshteinDistance(arr: number[]): number {
    let idx = 0;
    const len1 = arr[idx++];
    const seq1 = arr.slice(idx, idx + len1); idx += len1;
    const len2 = arr[idx++];
    const seq2 = arr.slice(idx, idx + len2);

    const dp: number[][] = Array.from({ length: len1 + 1 }, () =>
        new Array(len2 + 1).fill(0)
    );

    for (let i = 0; i <= len1; i++) dp[i][0] = i;
    for (let j = 0; j <= len2; j++) dp[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (seq1[i - 1] === seq2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[len1][len2];
}

console.log(levenshteinDistance([3, 1, 2, 3, 3, 1, 2, 4])); // 1
console.log(levenshteinDistance([2, 5, 6, 2, 5, 6]));       // 0
console.log(levenshteinDistance([2, 1, 2, 2, 3, 4]));       // 2
console.log(levenshteinDistance([0, 3, 1, 2, 3]));          // 3
