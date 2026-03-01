export function dpOnTrees(n: number, values: number[], edges: number[][]): number {
    if (n === 0) return 0;
    if (n === 1) return values[0];

    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);
    }

    const dp = new Array(n).fill(0);
    const parent = new Array(n).fill(-1);
    const visited = new Array(n).fill(false);

    // BFS order
    const order: number[] = [];
    const queue: number[] = [0];
    visited[0] = true;
    while (queue.length > 0) {
        const node = queue.shift()!;
        order.push(node);
        for (const child of adj[node]) {
            if (!visited[child]) {
                visited[child] = true;
                parent[child] = node;
                queue.push(child);
            }
        }
    }

    for (let i = order.length - 1; i >= 0; i--) {
        const node = order[i];
        let bestChild = 0;
        for (const child of adj[node]) {
            if (child !== parent[node]) {
                bestChild = Math.max(bestChild, dp[child]);
            }
        }
        dp[node] = values[node] + bestChild;
    }

    return Math.max(...dp);
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines: string[] = [];
rl.on('line', (line: string) => lines.push(line.trim()));
rl.on('close', () => {
    const n = parseInt(lines[0]);
    const values = lines[1].split(' ').map(Number);
    const edges: number[][] = [];
    for (let i = 2; i < 2 + n - 1; i++) {
        edges.push(lines[i].split(' ').map(Number));
    }
    console.log(dpOnTrees(n, values, edges));
});
