function extGcd(a: number, b: number): [number, number, number] {
    if (a === 0) return [b, 0, 1];
    const [g, x1, y1] = extGcd(b % a, a);
    return [g, y1 - Math.floor(b / a) * x1, x1];
}

export function extendedGcdApplications(arr: number[]): number {
    const a = arr[0], m = arr[1];
    const [g, x] = extGcd(((a % m) + m) % m, m);
    if (g !== 1) return -1;
    return ((x % m) + m) % m;
}

console.log(extendedGcdApplications([3, 7]));
console.log(extendedGcdApplications([1, 13]));
console.log(extendedGcdApplications([6, 9]));
console.log(extendedGcdApplications([2, 11]));
