const INF = 1000000000;

export function allPairsShortestPath(arr: number[]): number {
  if (arr.length < 2) return -1;

  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 3 * m) return -1;
  if (n <= 0) return -1;
  if (n === 1) return 0;

  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INF));
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }

  for (let i = 0; i < m; i++) {
    const u = arr[2 + 3 * i];
    const v = arr[2 + 3 * i + 1];
    const w = arr[2 + 3 * i + 2];

    if (u >= 0 && u < n && v >= 0 && v < n) {
      dist[u][v] = Math.min(dist[u][v], w);
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] !== INF && dist[k][j] !== INF) {
          dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);
        }
      }
    }
  }

  return dist[0][n - 1] === INF ? -1 : dist[0][n - 1];
}
