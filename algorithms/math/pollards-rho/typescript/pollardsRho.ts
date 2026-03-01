function gcd(a: number, b: number): number {
    a = Math.abs(a);
    while (b) { const t = b; b = a % b; a = t; }
    return a;
}

function isPrime(n: number): boolean {
    if (n < 2) return false;
    if (n < 4) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6)
        if (n % i === 0 || n % (i + 2) === 0) return false;
    return true;
}

function rho(n: number): number {
    if (n % 2 === 0) return 2;
    let x = 2, y = 2, c = 1, d = 1;
    while (d === 1) {
        x = (x * x + c) % n;
        y = (y * y + c) % n;
        y = (y * y + c) % n;
        d = gcd(Math.abs(x - y), n);
    }
    return d !== n ? d : n;
}

export function pollardsRho(n: number): number {
    if (n <= 1) return n;
    if (isPrime(n)) return n;

    let smallest = n;
    const stack: number[] = [n];
    while (stack.length > 0) {
        const num = stack.pop()!;
        if (num <= 1) continue;
        if (isPrime(num)) { smallest = Math.min(smallest, num); continue; }
        let d = rho(num);
        if (d === num) {
            for (let c = 2; c < 20; c++) {
                let xx = 2, yy = 2;
                d = 1;
                while (d === 1) {
                    xx = (xx * xx + c) % num;
                    yy = (yy * yy + c) % num;
                    yy = (yy * yy + c) % num;
                    d = gcd(Math.abs(xx - yy), num);
                }
                if (d !== num) break;
            }
        }
        stack.push(d, num / d);
    }
    return smallest;
}

console.log(pollardsRho(15));
console.log(pollardsRho(13));
console.log(pollardsRho(91));
console.log(pollardsRho(221));
