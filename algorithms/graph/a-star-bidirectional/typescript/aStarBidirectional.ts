export function aStarBidirectional(data: number[]): number {
    const rows = data[0], cols = data[1];
    const srcR = data[2], srcC = data[3];
    const dstR = data[4], dstC = data[5];
    const numBlocked = data[6];

    const blocked = new Set<number>();
    let idx = 7;
    for (let i = 0; i < numBlocked; i++) {
        blocked.add(data[idx] * cols + data[idx + 1]);
        idx += 2;
    }

    if (srcR === dstR && srcC === dstC) return 0;
    if (blocked.has(srcR * cols + srcC) || blocked.has(dstR * cols + dstC)) return -1;

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    const h = (r: number, c: number, tr: number, tc: number) => Math.abs(r - tr) + Math.abs(c - tc);

    // Simple BFS-based bidirectional for correctness
    const distF = new Map<number, number>();
    const distB = new Map<number, number>();
    const qF: number[][] = [[srcR, srcC]];
    const qB: number[][] = [[dstR, dstC]];
    distF.set(srcR * cols + srcC, 0);
    distB.set(dstR * cols + dstC, 0);

    let best = Infinity;

    while (qF.length > 0 || qB.length > 0) {
        // Forward
        const nextF: number[][] = [];
        for (const [r, c] of qF) {
            const key = r * cols + c;
            const g = distF.get(key)!;
            if (distB.has(key)) {
                best = Math.min(best, g + distB.get(key)!);
            }
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                const nk = nr * cols + nc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !blocked.has(nk) && !distF.has(nk)) {
                    distF.set(nk, g + 1);
                    nextF.push([nr, nc]);
                }
            }
        }
        qF.length = 0;
        qF.push(...nextF);

        if (best < Infinity) return best;

        // Backward
        const nextB: number[][] = [];
        for (const [r, c] of qB) {
            const key = r * cols + c;
            const g = distB.get(key)!;
            if (distF.has(key)) {
                best = Math.min(best, g + distF.get(key)!);
            }
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                const nk = nr * cols + nc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !blocked.has(nk) && !distB.has(nk)) {
                    distB.set(nk, g + 1);
                    nextB.push([nr, nc]);
                }
            }
        }
        qB.length = 0;
        qB.push(...nextB);

        if (best < Infinity) return best;
    }

    return best === Infinity ? -1 : best;
}
