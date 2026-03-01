function modPowRSA(base: number, exp: number, mod: number): number {
    let result = 1; base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}

function extGcd(a: number, b: number): [number, number, number] {
    if (a === 0) return [b, 0, 1];
    const [g, x1, y1] = extGcd(b % a, a);
    return [g, y1 - Math.floor(b / a) * x1, x1];
}

function modInverse(e: number, phi: number): number {
    const [, x] = extGcd(e % phi, phi);
    return ((x % phi) + phi) % phi;
}

export function rsaAlgorithm(p: number, q: number, e: number, message: number): number {
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    const d = modInverse(e, phi);
    const cipher = modPowRSA(message, e, n);
    return modPowRSA(cipher, d, n);
}

console.log(rsaAlgorithm(61, 53, 17, 65));
console.log(rsaAlgorithm(61, 53, 17, 42));
console.log(rsaAlgorithm(11, 13, 7, 9));
