export function karatsuba(arr: number[]): number {
    function multiply(x: number, y: number): number {
        if (x < 10 || y < 10) return x * y;

        const n = Math.max(
            Math.abs(x).toString().length,
            Math.abs(y).toString().length
        );
        const half = Math.floor(n / 2);
        const power = Math.pow(10, half);

        const x1 = Math.floor(x / power);
        const x0 = x % power;
        const y1 = Math.floor(y / power);
        const y0 = y % power;

        const z0 = multiply(x0, y0);
        const z2 = multiply(x1, y1);
        const z1 = multiply(x0 + x1, y0 + y1) - z0 - z2;

        return z2 * power * power + z1 * power + z0;
    }

    return multiply(arr[0], arr[1]);
}
