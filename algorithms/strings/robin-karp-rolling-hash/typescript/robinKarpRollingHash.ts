export function robinKarpRollingHash(arr: number[]): number {
    let idx = 0;
    const tlen = arr[idx++];
    const text = arr.slice(idx, idx + tlen); idx += tlen;
    const plen = arr[idx++];
    const pattern = arr.slice(idx, idx + plen);
    if (plen > tlen) return -1;

    // Use simple hash to avoid BigInt
    const BASE = 31, MOD = 1000000007;
    let pHash = 0, tHash = 0, power = 1;
    for (let i = 0; i < plen; i++) {
        pHash = (pHash + (pattern[i]+1) * power) % MOD;
        tHash = (tHash + (text[i]+1) * power) % MOD;
        if (i < plen - 1) power = (power * BASE) % MOD;
    }

    for (let i = 0; i <= tlen - plen; i++) {
        if (tHash === pHash) {
            let match = true;
            for (let j = 0; j < plen; j++) if (text[i+j] !== pattern[j]) { match = false; break; }
            if (match) return i;
        }
        if (i < tlen - plen) {
            // Recompute hash for next window
            tHash = 0; let pw = 1;
            for (let k = 0; k < plen; k++) {
                tHash = (tHash + (text[i+1+k]+1) * pw) % MOD;
                if (k < plen - 1) pw = (pw * BASE) % MOD;
            }
        }
    }
    return -1;
}

console.log(robinKarpRollingHash([5, 1, 2, 3, 4, 5, 2, 1, 2]));
console.log(robinKarpRollingHash([5, 1, 2, 3, 4, 5, 2, 3, 4]));
console.log(robinKarpRollingHash([4, 1, 2, 3, 4, 2, 5, 6]));
console.log(robinKarpRollingHash([4, 1, 2, 3, 4, 1, 4]));
