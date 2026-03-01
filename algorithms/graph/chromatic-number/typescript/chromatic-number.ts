export function chromaticNumber(arr: number[]): number {
  if (arr.length < 2) return 0;
  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 2 * m) return 0;
  if (n === 0) return 0;

  const adj: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 2 * i];
    const v = arr[2 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u][v] = true;
      adj[v][u] = true;
    }
  }

  const color: number[] = new Array(n).fill(0);

  function isSafe(u: number, c: number): boolean {
    for (let v = 0; v < n; v++) {
      if (adj[u][v] && color[v] === c) {
        return false;
      }
    }
    return true;
  }

  function graphColoringUtil(u: number, k: number): boolean {
    if (u === n) return true;

    for (let c = 1; c <= k; c++) {
      if (isSafe(u, c)) {
        color[u] = c;
        if (graphColoringUtil(u + 1, k)) {
          return true;
        }
        color[u] = 0;
      }
    }
    return false;
  }

  for (let k = 1; k <= n; k++) {
    if (graphColoringUtil(0, k)) {
      return k;
    }
  }

  return n;
}
