export function minimumSpanningArborescence(arr: number[]): number {
    let n = arr[0];
    const m = arr[1];
    let root = arr[2];
    let eu: number[] = [], ev: number[] = [], ew: number[] = [];
    for (let i = 0; i < m; i++) {
        eu.push(arr[3 + 3 * i]);
        ev.push(arr[3 + 3 * i + 1]);
        ew.push(arr[3 + 3 * i + 2]);
    }

    const INF = 1e9;
    let res = 0;

    while (true) {
        const minIn = new Array(n).fill(INF);
        const minEdge = new Array(n).fill(-1);

        for (let i = 0; i < eu.length; i++) {
            if (eu[i] !== ev[i] && ev[i] !== root && ew[i] < minIn[ev[i]]) {
                minIn[ev[i]] = ew[i];
                minEdge[ev[i]] = eu[i];
            }
        }

        for (let i = 0; i < n; i++) {
            if (i !== root && minIn[i] === INF) return -1;
        }

        const comp = new Array(n).fill(-1);
        comp[root] = root;
        let numCycles = 0;

        for (let i = 0; i < n; i++) {
            if (i !== root) res += minIn[i];
        }

        const visited = new Array(n).fill(-1);
        for (let i = 0; i < n; i++) {
            if (i === root) continue;
            let v = i;
            while (visited[v] === -1 && comp[v] === -1 && v !== root) {
                visited[v] = i;
                v = minEdge[v];
            }
            if (v !== root && comp[v] === -1 && visited[v] === i) {
                let u = v;
                do {
                    comp[u] = numCycles;
                    u = minEdge[u];
                } while (u !== v);
                numCycles++;
            }
        }

        if (numCycles === 0) break;

        for (let i = 0; i < n; i++) {
            if (comp[i] === -1) comp[i] = numCycles++;
        }

        const neu: number[] = [], nev: number[] = [], newW: number[] = [];
        for (let i = 0; i < eu.length; i++) {
            const nu = comp[eu[i]], nv = comp[ev[i]];
            if (nu !== nv) {
                neu.push(nu);
                nev.push(nv);
                newW.push(ew[i] - minIn[ev[i]]);
            }
        }

        eu = neu; ev = nev; ew = newW;
        root = comp[root];
        n = numCycles;
    }

    return res;
}
