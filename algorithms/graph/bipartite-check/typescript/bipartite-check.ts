export function isBipartite(arr: number[]): number {
  if (arr.length < 2) return 0;

  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 2 * m) return 0;
  if (n === 0) return 1;

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 2 * i];
    const v = arr[2 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  const color: number[] = new Array(n).fill(0); // 0: none, 1: red, -1: blue
  const q: number[] = [];

  for (let i = 0; i < n; i++) {
    if (color[i] === 0) {
      color[i] = 1;
      q.push(i);

      let head = 0;
      while (head < q.length) {
        const u = q[head++];

        for (const v of adj[u]) {
          if (color[v] === 0) {
            color[v] = -color[u];
            q.push(v);
          } else if (color[v] === color[u]) {
            return 0;
          }
        }
      }
      q.length = 0; // Clear queue for next component
    }
  }

  return 1;
}
