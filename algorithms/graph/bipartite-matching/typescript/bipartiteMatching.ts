/**
 * Hopcroft-Karp: Maximum bipartite matching in O(E * sqrt(V)).
 */
export function hopcroftKarp(numLeft: number, numRight: number, edges: [number, number][]): number {
    const adj: number[][] = Array.from({ length: numLeft }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
    }

    const matchLeft = new Array(numLeft).fill(-1);
    const matchRight = new Array(numRight).fill(-1);
    const dist = new Array(numLeft).fill(0);
    const INF = Number.MAX_SAFE_INTEGER;

    function bfs(): boolean {
        const queue: number[] = [];
        for (let u = 0; u < numLeft; u++) {
            if (matchLeft[u] === -1) {
                dist[u] = 0;
                queue.push(u);
            } else {
                dist[u] = INF;
            }
        }
        let found = false;
        let front = 0;
        while (front < queue.length) {
            const u = queue[front++];
            for (const v of adj[u]) {
                const nextU = matchRight[v];
                if (nextU === -1) {
                    found = true;
                } else if (dist[nextU] === INF) {
                    dist[nextU] = dist[u] + 1;
                    queue.push(nextU);
                }
            }
        }
        return found;
    }

    function dfs(u: number): boolean {
        for (const v of adj[u]) {
            const nextU = matchRight[v];
            if (nextU === -1 || (dist[nextU] === dist[u] + 1 && dfs(nextU))) {
                matchLeft[u] = v;
                matchRight[v] = u;
                return true;
            }
        }
        dist[u] = INF;
        return false;
    }

    let matching = 0;
    while (bfs()) {
        for (let u = 0; u < numLeft; u++) {
            if (matchLeft[u] === -1 && dfs(u)) {
                matching++;
            }
        }
    }
    return matching;
}

// Main
const edges: [number, number][] = [[0, 0], [0, 1], [1, 0], [2, 2]];
console.log("Max matching:", hopcroftKarp(3, 3, edges));
