export function isPrime(n: number): boolean {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

console.log(`2 is prime: ${isPrime(2)}`);
console.log(`4 is prime: ${isPrime(4)}`);
console.log(`97 is prime: ${isPrime(97)}`);
