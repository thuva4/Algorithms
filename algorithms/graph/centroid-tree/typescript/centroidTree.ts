export function centroidTree(arr: number[]): number {
    const n = arr[0];
    if (n <= 1) return 0;
    const adj: number[][] = Array.from({ length: n }, () => []);
    const m = n - 1;
    for (let i = 0; i < m; i++) {
        const u = arr[1 + 2 * i];
        const v = arr[1 + 2 * i + 1];
        adj[u].push(v);
        adj[v].push(u);
    }

    const removed = new Array(n).fill(false);
    const subSize = new Array(n).fill(0);

    function computeSize(v: number, parent: number): void {
        subSize[v] = 1;
        for (const u of adj[v]) {
            if (u !== parent && !removed[u]) {
                computeSize(u, v);
                subSize[v] += subSize[u];
            }
        }
    }

    function findCentroid(v: number, parent: number, treeSize: number): number {
        for (const u of adj[v]) {
            if (u !== parent && !removed[u]) {
                if (subSize[u] > Math.floor(treeSize / 2)) {
                    return findCentroid(u, v, treeSize);
                }
            }
        }
        return v;
    }

    function decompose(v: number): number {
        computeSize(v, -1);
        const treeSize = subSize[v];
        const centroid = findCentroid(v, -1, treeSize);
        removed[centroid] = true;

        let maxDepth = 0;
        for (const u of adj[centroid]) {
            if (!removed[u]) {
                const d = decompose(u);
                maxDepth = Math.max(maxDepth, d + 1);
            }
        }

        removed[centroid] = false;
        return maxDepth;
    }

    return decompose(0);
}
