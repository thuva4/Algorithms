export function stronglyConnectedPathBased(arr: number[]): number {
    const n = arr[0], m = arr[1];
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < m; i++) adj[arr[2 + 2 * i]].push(arr[2 + 2 * i + 1]);

    const preorder = new Array(n).fill(-1);
    let counter = 0, sccCount = 0;
    const sStack: number[] = [], pStack: number[] = [];
    const assigned = new Array(n).fill(false);

    function dfs(v: number): void {
        preorder[v] = counter++;
        sStack.push(v); pStack.push(v);

        for (const w of adj[v]) {
            if (preorder[w] === -1) {
                dfs(w);
            } else if (!assigned[w]) {
                while (pStack.length > 0 && preorder[pStack[pStack.length - 1]] > preorder[w]) pStack.pop();
            }
        }

        if (pStack.length > 0 && pStack[pStack.length - 1] === v) {
            pStack.pop();
            sccCount++;
            while (true) {
                const u = sStack.pop()!;
                assigned[u] = true;
                if (u === v) break;
            }
        }
    }

    for (let v = 0; v < n; v++) {
        if (preorder[v] === -1) dfs(v);
    }
    return sccCount;
}
