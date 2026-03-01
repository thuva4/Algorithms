export function countBridges(arr: number[]): number {
  if (arr.length < 2) return 0;
  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 2 * m) return 0;

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 2 * i];
    const v = arr[2 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  const dfn: number[] = new Array(n).fill(0);
  const low: number[] = new Array(n).fill(0);
  let timer = 0;
  let bridgeCount = 0;

  function dfs(u: number, p: number): void {
    timer++;
    dfn[u] = low[u] = timer;

    for (const v of adj[u]) {
      if (v === p) continue;
      if (dfn[v] !== 0) {
        low[u] = Math.min(low[u], dfn[v]);
      } else {
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > dfn[u]) {
          bridgeCount++;
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    if (dfn[i] === 0) dfs(i, -1);
  }

  return bridgeCount;
}
