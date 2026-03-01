export function minimumCutStoerWagner(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const w: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    let idx = 2;
    for (let i = 0; i < m; i++) {
        const u = arr[idx], v = arr[idx + 1], c = arr[idx + 2];
        w[u][v] += c;
        w[v][u] += c;
        idx += 3;
    }

    const merged = new Array(n).fill(false);
    let best = Infinity;

    for (let phase = 0; phase < n - 1; phase++) {
        const key = new Array(n).fill(0);
        const inA = new Array(n).fill(false);
        let prev = -1, last = -1;

        for (let it = 0; it < n - phase; it++) {
            let sel = -1;
            for (let v = 0; v < n; v++) {
                if (!merged[v] && !inA[v]) {
                    if (sel === -1 || key[v] > key[sel]) {
                        sel = v;
                    }
                }
            }
            inA[sel] = true;
            prev = last;
            last = sel;
            for (let v = 0; v < n; v++) {
                if (!merged[v] && !inA[v]) {
                    key[v] += w[sel][v];
                }
            }
        }

        best = Math.min(best, key[last]);

        for (let v = 0; v < n; v++) {
            w[prev][v] += w[last][v];
            w[v][prev] += w[v][last];
        }
        merged[last] = true;
    }

    return best;
}
