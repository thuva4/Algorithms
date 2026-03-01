export function stackOps(arr: number[]): number {
    if (arr.length === 0) return 0;
    const stack: number[] = [];
    const opCount = arr[0];
    let idx = 1, total = 0;
    for (let i = 0; i < opCount; i++) {
        const type = arr[idx], val = arr[idx + 1];
        idx += 2;
        if (type === 1) stack.push(val);
        else if (type === 2) total += stack.length > 0 ? stack.pop()! : -1;
    }
    return total;
}
