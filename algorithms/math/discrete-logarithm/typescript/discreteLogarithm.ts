export function discreteLogarithm(base: number, target: number, modulus: number): number {
    if (modulus === 1) return 0;
    const normalizedTarget = ((target % modulus) + modulus) % modulus;
    let value = 1 % modulus;
    for (let exponent = 0; exponent <= modulus; exponent++) {
        if (value === normalizedTarget) {
            return exponent;
        }
        value = value * (base % modulus) % modulus;
    }
    return -1;
}
