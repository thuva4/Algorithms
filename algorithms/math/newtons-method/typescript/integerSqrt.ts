export function integerSqrt(arr: number[]): number {
    const n = arr[0];
    if (n <= 1) return n;
    let x = n;
    while (true) {
        const x1 = Math.floor((x + Math.floor(n / x)) / 2);
        if (x1 >= x) return x;
        x = x1;
    }
}
