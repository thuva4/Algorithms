/**
 * Find the minimum spanning tree using Boruvka's algorithm.
 *
 * Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
 * @param arr - input array
 * @returns total weight of the MST
 */
export function minimumSpanningTreeBoruvka(arr: number[]): number {
    let idx = 0;
    const n = arr[idx++];
    const m = arr[idx++];
    const eu: number[] = [], ev: number[] = [], ew: number[] = [];
    for (let i = 0; i < m; i++) {
        eu.push(arr[idx++]);
        ev.push(arr[idx++]);
        ew.push(arr[idx++]);
    }

    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);

    function find(x: number): number {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
    }

    function unite(x: number, y: number): boolean {
        let rx = find(x), ry = find(y);
        if (rx === ry) return false;
        if (rank[rx] < rank[ry]) { [rx, ry] = [ry, rx]; }
        parent[ry] = rx;
        if (rank[rx] === rank[ry]) rank[rx]++;
        return true;
    }

    let totalWeight = 0;
    let numComponents = n;

    while (numComponents > 1) {
        const cheapest = new Array(n).fill(-1);

        for (let i = 0; i < m; i++) {
            const ru = find(eu[i]), rv = find(ev[i]);
            if (ru === rv) continue;
            if (cheapest[ru] === -1 || ew[i] < ew[cheapest[ru]]) cheapest[ru] = i;
            if (cheapest[rv] === -1 || ew[i] < ew[cheapest[rv]]) cheapest[rv] = i;
        }

        for (let node = 0; node < n; node++) {
            if (cheapest[node] !== -1) {
                if (unite(eu[cheapest[node]], ev[cheapest[node]])) {
                    totalWeight += ew[cheapest[node]];
                    numComponents--;
                }
            }
        }
    }

    return totalWeight;
}

console.log(minimumSpanningTreeBoruvka([3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3]));
console.log(minimumSpanningTreeBoruvka([4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4]));
console.log(minimumSpanningTreeBoruvka([2, 1, 0, 1, 7]));
console.log(minimumSpanningTreeBoruvka([4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3]));
