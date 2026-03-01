export function rabinKarpSearch(text: string, pattern: string): number {
    const prime = 101;
    const base = 256;
    const n = text.length;
    const m = pattern.length;

    if (m === 0) return 0;
    if (m > n) return -1;

    let patHash = 0;
    let txtHash = 0;
    let h = 1;

    for (let i = 0; i < m - 1; i++) {
        h = (h * base) % prime;
    }

    for (let i = 0; i < m; i++) {
        patHash = (base * patHash + pattern.charCodeAt(i)) % prime;
        txtHash = (base * txtHash + text.charCodeAt(i)) % prime;
    }

    for (let i = 0; i <= n - m; i++) {
        if (patHash === txtHash) {
            let match = true;
            for (let j = 0; j < m; j++) {
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return i;
        }
        if (i < n - m) {
            txtHash = (base * (txtHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % prime;
            if (txtHash < 0) txtHash += prime;
        }
    }
    return -1;
}

const text = "ABABDABACDABABCABAB";
const pattern = "ABABCABAB";
console.log(`Pattern found at index: ${rabinKarpSearch(text, pattern)}`);
