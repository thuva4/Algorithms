function computeLPS(pattern: string): number[] {
    const m = pattern.length;
    const lps: number[] = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    while (i < m) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len !== 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

export function kmpSearch(text: string, pattern: string): number {
    const n = text.length;
    const m = pattern.length;

    if (m === 0) return 0;

    const lps = computeLPS(pattern);

    let i = 0;
    let j = 0;
    while (i < n) {
        if (pattern[j] === text[i]) {
            i++;
            j++;
        }
        if (j === m) {
            return i - j;
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return -1;
}

const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
console.log(`Pattern found at index: ${kmpSearch(text, pattern)}`);
