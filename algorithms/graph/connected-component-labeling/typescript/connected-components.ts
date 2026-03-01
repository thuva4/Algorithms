export function connectedComponents(arr: number[]): number[] {
  if (arr.length < 2) return [];

  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 2 * m) return [];
  if (n === 0) return [];

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[2 + 2 * i];
    const v = arr[2 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  const labels: number[] = new Array(n).fill(-1);
  const q: number[] = [];

  for (let i = 0; i < n; i++) {
    if (labels[i] === -1) {
      const componentId = i;
      labels[i] = componentId;
      q.push(i);

      let head = 0;
      while (head < q.length) {
        const u = q[head++];

        for (const v of adj[u]) {
          if (labels[v] === -1) {
            labels[v] = componentId;
            q.push(v);
          }
        }
      }
      q.length = 0;
    }
  }

  return labels;
}
