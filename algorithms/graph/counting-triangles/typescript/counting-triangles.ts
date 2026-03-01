export function countingTriangles(arr: number[]): number {
  if (arr.length < 2) return 0;
  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 2 * m) return 0;
  if (n < 3) return 0;

  const adj: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 2 * i];
    const v = arr[2 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u][v] = true;
      adj[v][u] = true;
    }
  }

  let count = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (adj[i][j]) {
        for (let k = j + 1; k < n; k++) {
          if (adj[j][k] && adj[k][i]) {
            count++;
          }
        }
      }
    }
  }

  return count;
}
