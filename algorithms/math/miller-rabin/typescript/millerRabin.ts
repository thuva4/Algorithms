export function millerRabin(n: number): number {
    if (n < 2) return 0;
    if (n < 4) return 1;
    if (n % 2 === 0) return 0;

    function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
        let result = 1n;
        base %= mod;
        while (exp > 0n) {
            if (exp % 2n === 1n) result = result * base % mod;
            exp /= 2n;
            base = base * base % mod;
        }
        return result;
    }

    const bn = BigInt(n);
    let r = 0;
    let d = bn - 1n;
    while (d % 2n === 0n) { r++; d /= 2n; }

    const witnesses = [2n, 3n, 5n, 7n];
    for (const a of witnesses) {
        if (a >= bn) continue;

        let x = modPow(a, d, bn);
        if (x === 1n || x === bn - 1n) continue;

        let found = false;
        for (let i = 0; i < r - 1; i++) {
            x = modPow(x, 2n, bn);
            if (x === bn - 1n) { found = true; break; }
        }

        if (!found) return 0;
    }

    return 1;
}
