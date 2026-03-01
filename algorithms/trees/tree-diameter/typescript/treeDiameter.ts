export function treeDiameter(arr: number[]): number {
    let idx = 0;
    const n = arr[idx++];
    if (n <= 1) return 0;

    const adj: number[][] = Array.from({ length: n }, () => []);
    const m = (arr.length - 1) >> 1;
    for (let i = 0; i < m; i++) {
        const u = arr[idx++], v = arr[idx++];
        adj[u].push(v);
        adj[v].push(u);
    }

    function bfs(start: number): [number, number] {
        const dist = new Array(n).fill(-1);
        dist[start] = 0;
        const queue = [start];
        let front = 0, farthest = start;
        while (front < queue.length) {
            const node = queue[front++];
            for (const nb of adj[node]) {
                if (dist[nb] === -1) {
                    dist[nb] = dist[node] + 1;
                    queue.push(nb);
                    if (dist[nb] > dist[farthest]) farthest = nb;
                }
            }
        }
        return [farthest, dist[farthest]];
    }

    const [u] = bfs(0);
    const [, diameter] = bfs(u);
    return diameter;
}

console.log(treeDiameter([4, 0, 1, 1, 2, 2, 3]));
console.log(treeDiameter([5, 0, 1, 0, 2, 0, 3, 0, 4]));
console.log(treeDiameter([2, 0, 1]));
console.log(treeDiameter([1]));
