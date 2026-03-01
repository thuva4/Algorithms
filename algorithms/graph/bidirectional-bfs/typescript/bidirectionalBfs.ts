export function bidirectionalBfs(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const src = arr[2];
    const dst = arr[3];
    if (src === dst) return 0;

    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[4 + 2 * i];
        const v = arr[4 + 2 * i + 1];
        adj[u].push(v);
        adj[v].push(u);
    }

    const distS = new Array(n).fill(-1);
    const distT = new Array(n).fill(-1);
    distS[src] = 0;
    distT[dst] = 0;
    const qS: number[] = [src];
    const qT: number[] = [dst];
    let iS = 0, iT = 0;

    while (iS < qS.length || iT < qT.length) {
        if (iS < qS.length) {
            const u = qS[iS++];
            for (const v of adj[u]) {
                if (distS[v] === -1) {
                    distS[v] = distS[u] + 1;
                    qS.push(v);
                }
                if (distT[v] !== -1) return distS[v] + distT[v];
            }
        }
        if (iT < qT.length) {
            const u = qT[iT++];
            for (const v of adj[u]) {
                if (distT[v] === -1) {
                    distT[v] = distT[u] + 1;
                    qT.push(v);
                }
                if (distS[v] !== -1) return distS[v] + distT[v];
            }
        }
    }

    return -1;
}
