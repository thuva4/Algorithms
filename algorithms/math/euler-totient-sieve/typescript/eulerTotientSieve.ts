export function eulerTotientSieve(n: number): number {
    const phi = new Array(n + 1);
    for (let i = 0; i <= n; i++) phi[i] = i;
    for (let i = 2; i <= n; i++) {
        if (phi[i] === i) {
            for (let j = i; j <= n; j += i) {
                phi[j] -= Math.floor(phi[j] / i);
            }
        }
    }
    let sum = 0;
    for (let i = 1; i <= n; i++) sum += phi[i];
    return sum;
}

console.log(eulerTotientSieve(1));
console.log(eulerTotientSieve(10));
console.log(eulerTotientSieve(100));
