const INF = 1000000000;

export function bellmanFord(arr: number[]): number[] {
  if (arr.length < 2) return [];

  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 3 * m + 1) return [];

  const start = arr[2 + 3 * m];

  if (start < 0 || start >= n) return [];

  const dist = new Array(n).fill(INF);
  dist[start] = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < m; j++) {
      const u = arr[2 + 3 * j];
      const v = arr[2 + 3 * j + 1];
      const w = arr[2 + 3 * j + 2];

      if (dist[u] !== INF && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  for (let j = 0; j < m; j++) {
    const u = arr[2 + 3 * j];
    const v = arr[2 + 3 * j + 1];
    const w = arr[2 + 3 * j + 2];

    if (dist[u] !== INF && dist[u] + w < dist[v]) {
      return []; // Negative cycle
    }
  }

  return dist;
}
