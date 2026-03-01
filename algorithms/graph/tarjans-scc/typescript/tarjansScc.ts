export function tarjansScc(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[2 + 2 * i];
        const v = arr[2 + 2 * i + 1];
        adj[u].push(v);
    }

    let indexCounter = 0;
    let sccCount = 0;
    const disc = new Array(n).fill(-1);
    const low = new Array(n).fill(0);
    const onStack = new Array(n).fill(false);
    const stack: number[] = [];

    function strongconnect(v: number): void {
        disc[v] = indexCounter;
        low[v] = indexCounter;
        indexCounter++;
        stack.push(v);
        onStack[v] = true;

        for (const w of adj[v]) {
            if (disc[w] === -1) {
                strongconnect(w);
                low[v] = Math.min(low[v], low[w]);
            } else if (onStack[w]) {
                low[v] = Math.min(low[v], disc[w]);
            }
        }

        if (low[v] === disc[v]) {
            sccCount++;
            while (true) {
                const w = stack.pop()!;
                onStack[w] = false;
                if (w === v) break;
            }
        }
    }

    for (let v = 0; v < n; v++) {
        if (disc[v] === -1) {
            strongconnect(v);
        }
    }

    return sccCount;
}
