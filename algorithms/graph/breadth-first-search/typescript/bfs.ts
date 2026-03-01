export function bfs(arr: number[]): number[] {
  if (arr.length < 2) return [];

  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 2 * m + 1) return [];

  const start = arr[2 + 2 * m];
  if (start < 0 || start >= n) return [];

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 2 * i];
    const v = arr[2 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  for (let i = 0; i < n; i++) {
    adj[i].sort((a, b) => a - b);
  }

  const result: number[] = [];
  const visited: boolean[] = new Array(n).fill(false);
  const q: number[] = [start];
  visited[start] = true;

  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    result.push(u);

    for (const v of adj[u]) {
      if (!visited[v]) {
        visited[v] = true;
        q.push(v);
      }
    }
  }

  return result;
}
