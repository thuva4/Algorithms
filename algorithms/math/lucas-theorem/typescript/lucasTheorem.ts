function modPowLucas(base: number, exp: number, mod: number): number {
    let result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1; base = base * base % mod;
    }
    return result;
}

export function lucasTheorem(n: number, k: number, p: number): number {
    if (k > n) return 0;
    const fact = new Array(p);
    fact[0] = 1;
    for (let i = 1; i < p; i++) fact[i] = fact[i - 1] * i % p;

    let result = 1;
    while (n > 0 || k > 0) {
        const ni = n % p, ki = k % p;
        if (ki > ni) return 0;
        const c = fact[ni] * modPowLucas(fact[ki], p - 2, p) % p * modPowLucas(fact[ni - ki], p - 2, p) % p;
        result = result * c % p;
        n = Math.floor(n / p);
        k = Math.floor(k / p);
    }
    return result;
}

console.log(lucasTheorem(10, 3, 7));
console.log(lucasTheorem(5, 2, 3));
console.log(lucasTheorem(100, 50, 13));
