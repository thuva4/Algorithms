export function lowestCommonAncestor(arr: number[]): number {
    let idx = 0;
    const n = arr[idx++];
    const root = arr[idx++];

    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < n - 1; i++) {
        const u = arr[idx++], v = arr[idx++];
        adj[u].push(v); adj[v].push(u);
    }
    const qa = arr[idx++], qb = arr[idx++];

    let LOG = 1;
    while ((1 << LOG) < n) LOG++;

    const depth = new Array(n).fill(0);
    const up: number[][] = Array.from({ length: LOG }, () => new Array(n).fill(-1));

    const visited = new Array(n).fill(false);
    visited[root] = true;
    up[0][root] = root;
    const queue = [root];
    let front = 0;
    while (front < queue.length) {
        const v = queue[front++];
        for (const u of adj[v]) {
            if (!visited[u]) {
                visited[u] = true;
                depth[u] = depth[v] + 1;
                up[0][u] = v;
                queue.push(u);
            }
        }
    }

    for (let k = 1; k < LOG; k++)
        for (let v = 0; v < n; v++)
            up[k][v] = up[k - 1][up[k - 1][v]];

    let a = qa, b = qb;
    if (depth[a] < depth[b]) { [a, b] = [b, a]; }
    let diff = depth[a] - depth[b];
    for (let k = 0; k < LOG; k++)
        if ((diff >> k) & 1) a = up[k][a];
    if (a === b) return a;
    for (let k = LOG - 1; k >= 0; k--)
        if (up[k][a] !== up[k][b]) { a = up[k][a]; b = up[k][b]; }
    return up[0][a];
}

console.log(lowestCommonAncestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 2]));
console.log(lowestCommonAncestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 1, 3]));
console.log(lowestCommonAncestor([3, 0, 0, 1, 0, 2, 2, 2]));
console.log(lowestCommonAncestor([5, 0, 0, 1, 0, 2, 1, 3, 1, 4, 3, 4]));
