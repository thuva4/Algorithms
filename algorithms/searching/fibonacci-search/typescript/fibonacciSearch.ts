export function fibonacciSearch(arr: number[], target: number): number {
    const n = arr.length;
    if (n === 0) return -1;

    let fib2 = 0;
    let fib1 = 1;
    let fib = fib1 + fib2;

    while (fib < n) {
        fib2 = fib1;
        fib1 = fib;
        fib = fib1 + fib2;
    }

    let offset = -1;

    while (fib > 1) {
        const i = Math.min(offset + fib2, n - 1);

        if (arr[i] < target) {
            fib = fib1;
            fib1 = fib2;
            fib2 = fib - fib1;
            offset = i;
        } else if (arr[i] > target) {
            fib = fib2;
            fib1 = fib1 - fib2;
            fib2 = fib - fib1;
        } else {
            return i;
        }
    }

    if (fib1 === 1 && offset + 1 < n && arr[offset + 1] === target) {
        return offset + 1;
    }

    return -1;
}
