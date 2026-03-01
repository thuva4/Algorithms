export function connectedComponents(arr: number[]): number[] {
  if (arr.length < 2) {
    return [];
  }

  const n = arr[0];
  const m = arr[1];
  const adj: number[][] = Array.from({ length: n }, () => []);

  for (let i = 0; i < m; i += 1) {
    const u = arr[2 + 2 * i];
    const v = arr[2 + 2 * i + 1];
    adj[u].push(v);
    adj[v].push(u);
  }

  const labels = new Array(n).fill(-1);
  for (let start = 0; start < n; start += 1) {
    if (labels[start] !== -1) {
      continue;
    }

    const queue = [start];
    labels[start] = start;
    for (let head = 0; head < queue.length; head += 1) {
      const node = queue[head];
      for (const neighbor of adj[node]) {
        if (labels[neighbor] === -1) {
          labels[neighbor] = start;
          queue.push(neighbor);
        }
      }
    }
  }

  return labels;
}
