export function centroidDecomposition(arr: number[]): number {
    let idx = 0;
    const n = arr[idx++];
    if (n <= 1) return 0;

    const adj: number[][] = Array.from({ length: n }, () => []);
    const m = (arr.length - 1) >> 1;
    for (let i = 0; i < m; i++) {
        const u = arr[idx++], v = arr[idx++];
        adj[u].push(v); adj[v].push(u);
    }

    const removed = new Array(n).fill(false);
    const subSize = new Array(n).fill(0);

    function getSubSize(v: number, parent: number): void {
        subSize[v] = 1;
        for (const u of adj[v])
            if (u !== parent && !removed[u]) { getSubSize(u, v); subSize[v] += subSize[u]; }
    }

    function getCentroid(v: number, parent: number, treeSize: number): number {
        for (const u of adj[v])
            if (u !== parent && !removed[u] && subSize[u] > treeSize >> 1)
                return getCentroid(u, v, treeSize);
        return v;
    }

    function decompose(v: number, depth: number): number {
        getSubSize(v, -1);
        const centroid = getCentroid(v, -1, subSize[v]);
        removed[centroid] = true;
        let maxDepth = depth;
        for (const u of adj[centroid])
            if (!removed[u]) { const r = decompose(u, depth + 1); if (r > maxDepth) maxDepth = r; }
        removed[centroid] = false;
        return maxDepth;
    }

    return decompose(0, 0);
}

console.log(centroidDecomposition([4, 0, 1, 1, 2, 2, 3]));
console.log(centroidDecomposition([5, 0, 1, 0, 2, 0, 3, 0, 4]));
console.log(centroidDecomposition([1]));
console.log(centroidDecomposition([7, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6]));
