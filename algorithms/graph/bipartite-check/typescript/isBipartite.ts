export function isBipartite(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) {
        const u = arr[2 + 2 * i];
        const v = arr[2 + 2 * i + 1];
        adj[u].push(v);
        adj[v].push(u);
    }

    const color = new Array(n).fill(-1);

    for (let start = 0; start < n; start++) {
        if (color[start] !== -1) continue;
        color[start] = 0;
        const queue: number[] = [start];
        let front = 0;
        while (front < queue.length) {
            const u = queue[front++];
            for (const v of adj[u]) {
                if (color[v] === -1) {
                    color[v] = 1 - color[u];
                    queue.push(v);
                } else if (color[v] === color[u]) {
                    return 0;
                }
            }
        }
    }

    return 1;
}
