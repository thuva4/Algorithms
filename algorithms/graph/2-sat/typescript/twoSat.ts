export function twoSat(arr: number[]): number {
    const nVars = arr[0];
    const nClauses = arr[1];
    const numNodes = 2 * nVars;
    const adj: number[][] = Array.from({ length: numNodes }, () => []);

    const varNode = (lit: number): number => lit > 0 ? lit - 1 : nVars + (-lit - 1);
    const negNode = (node: number): number => node < nVars ? node + nVars : node - nVars;

    for (let i = 0; i < nClauses; i++) {
        const a = arr[2 + 2 * i];
        const b = arr[2 + 2 * i + 1];
        const na = varNode(a);
        const nb = varNode(b);
        adj[negNode(na)].push(nb);
        adj[negNode(nb)].push(na);
    }

    let indexCounter = 0;
    let sccId = 0;
    const disc = new Array(numNodes).fill(-1);
    const low = new Array(numNodes).fill(0);
    const comp = new Array(numNodes).fill(-1);
    const onStack = new Array(numNodes).fill(false);
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
            while (true) {
                const w = stack.pop()!;
                onStack[w] = false;
                comp[w] = sccId;
                if (w === v) break;
            }
            sccId++;
        }
    }

    for (let v = 0; v < numNodes; v++) {
        if (disc[v] === -1) strongconnect(v);
    }

    for (let i = 0; i < nVars; i++) {
        if (comp[i] === comp[i + nVars]) return 0;
    }

    return 1;
}
