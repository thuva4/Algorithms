export function jumpSearch(arr: number[], target: number): number {
    const n = arr.length;
    if (n === 0) return -1;
    const jumpSize = Math.floor(Math.sqrt(n));
    let prev = 0, step = jumpSize;
    while (prev < n && arr[Math.min(step, n) - 1] < target) {
        prev = step; step += jumpSize;
        if (prev >= n) return -1;
    }
    for (let i = prev; i < Math.min(step, n); i++) {
        if (arr[i] === target) return i;
    }
    return -1;
}
