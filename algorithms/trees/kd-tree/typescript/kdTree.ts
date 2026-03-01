export function kdTree(data: number[]): number {
    const n = data[0];
    const qx = data[1 + 2 * n], qy = data[2 + 2 * n];
    let best = Infinity;
    let idx = 1;
    for (let i = 0; i < n; i++) {
        const dx = data[idx] - qx, dy = data[idx + 1] - qy;
        const d = dx * dx + dy * dy;
        if (d < best) best = d;
        idx += 2;
    }
    return best;
}

console.log(kdTree([3, 1, 2, 3, 4, 5, 6, 3, 3]));
console.log(kdTree([2, 0, 0, 5, 5, 0, 0]));
console.log(kdTree([1, 3, 4, 0, 0]));
