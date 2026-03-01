function extGcd(a: number, b: number): [number, number, number] {
    if (a === 0) return [b, 0, 1];
    const [g, x1, y1] = extGcd(b % a, a);
    return [g, y1 - Math.floor(b / a) * x1, x1];
}

export function chineseRemainder(arr: number[]): number {
    const n = arr[0];
    let r = arr[1];
    let m = arr[2];

    for (let i = 1; i < n; i++) {
        const r2 = arr[1 + 2 * i];
        const m2 = arr[2 + 2 * i];
        const [g, p] = extGcd(m, m2);
        const lcm = Math.floor(m / g) * m2;
        r = ((r + m * Math.floor((r2 - r) / g) * p) % lcm + lcm) % lcm;
        m = lcm;
    }

    return r % m;
}
