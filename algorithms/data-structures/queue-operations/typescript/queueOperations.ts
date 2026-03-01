export function queueOps(arr: number[]): number {
    if (arr.length === 0) return 0;
    const queue: number[] = [];
    const opCount = arr[0];
    let idx = 1, total = 0, front = 0;
    for (let i = 0; i < opCount; i++) {
        const type = arr[idx], val = arr[idx + 1]; idx += 2;
        if (type === 1) queue.push(val);
        else if (type === 2 && front < queue.length) total += queue[front++];
    }
    return total;
}
