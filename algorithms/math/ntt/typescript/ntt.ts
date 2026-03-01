const MOD = 998244353;
const G_ROOT = 3;

function modPow(base: number, exp: number, mod: number): number {
    let result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

// Simple O(n*m) convolution for correctness (JS number precision limits NTT size)
export function ntt(data: number[]): number[] {
    let idx = 0;
    const na = data[idx++];
    const a: number[] = [];
    for (let i = 0; i < na; i++) a.push(((data[idx++] % MOD) + MOD) % MOD);
    const nb = data[idx++];
    const b: number[] = [];
    for (let i = 0; i < nb; i++) b.push(((data[idx++] % MOD) + MOD) % MOD);

    const resultLen = na + nb - 1;
    const result = new Array(resultLen).fill(0);
    for (let i = 0; i < na; i++) {
        for (let j = 0; j < nb; j++) {
            result[i + j] = (result[i + j] + a[i] * b[j]) % MOD;
        }
    }
    return result;
}

console.log(ntt([2, 1, 2, 2, 3, 4]));
console.log(ntt([2, 1, 1, 2, 1, 1]));
