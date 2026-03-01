function modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

const p = 23;
const g = 5;
const a = 6;
const b = 15;

const publicA = modPow(g, a, p);
console.log(`Alice sends: ${publicA}`);

const publicB = modPow(g, b, p);
console.log(`Bob sends: ${publicB}`);

const aliceSecret = modPow(publicB, a, p);
console.log(`Alice's shared secret: ${aliceSecret}`);

const bobSecret = modPow(publicA, b, p);
console.log(`Bob's shared secret: ${bobSecret}`);
