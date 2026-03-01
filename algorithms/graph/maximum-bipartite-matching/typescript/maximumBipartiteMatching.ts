export function maximumBipartiteMatching(arr: number[]): number {
    const nLeft = arr[0], nRight = arr[1], m = arr[2];
    const adj: number[][] = Array.from({ length: nLeft }, () => []);
    for (let i = 0; i < m; i++) adj[arr[3 + 2 * i]].push(arr[3 + 2 * i + 1]);
    const matchRight = new Array(nRight).fill(-1);

    function dfs(u: number, visited: boolean[]): boolean {
        for (const v of adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                if (matchRight[v] === -1 || dfs(matchRight[v], visited)) {
                    matchRight[v] = u; return true;
                }
            }
        }
        return false;
    }

    let result = 0;
    for (let u = 0; u < nLeft; u++) {
        const visited = new Array(nRight).fill(false);
        if (dfs(u, visited)) result++;
    }
    return result;
}
