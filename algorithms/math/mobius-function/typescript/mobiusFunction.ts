export function mobiusFunction(n: number): number {
    if (n <= 0) return 0;

    const mu = new Array(n + 1).fill(0);
    const primes: number[] = [];
    const isComposite = new Array(n + 1).fill(false);
    mu[1] = 1;

    for (let i = 2; i <= n; i++) {
        if (!isComposite[i]) {
            primes.push(i);
            mu[i] = -1;
        }

        for (const prime of primes) {
            const next = i * prime;
            if (next > n) {
                break;
            }
            isComposite[next] = true;
            if (i % prime === 0) {
                mu[next] = 0;
                break;
            }
            mu[next] = -mu[i];
        }
    }

    let sum = 0;
    for (let i = 1; i <= n; i++) sum += mu[i];
    return sum;
}
