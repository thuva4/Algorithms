export function catalanNumbers(n: number): number {
    const MOD = 1000000007n;

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

    function modInv(a: bigint, mod: bigint): bigint {
        return modPow(a, mod - 2n, mod);
    }

    let result = 1n;
    for (let i = 1; i <= n; i++) {
        result = result * BigInt(2 * (2 * i - 1)) % MOD;
        result = result * modInv(BigInt(i + 1), MOD) % MOD;
    }

    return Number(result);
}
