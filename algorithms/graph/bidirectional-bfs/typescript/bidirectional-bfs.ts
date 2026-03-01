export function bidirectionalBfs(arr: number[]): number {
  if (arr.length < 4) return -1;

  const n = arr[0];
  const m = arr[1];
  const start = arr[2];
  const end = arr[3];

  if (arr.length < 4 + 2 * m) return -1;
  if (start === end) return 0;

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[4 + 2 * i];
    const v = arr[4 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  const distStart: number[] = new Array(n).fill(-1);
  const distEnd: number[] = new Array(n).fill(-1);

  const qStart: number[] = [start];
  distStart[start] = 0;

  const qEnd: number[] = [end];
  distEnd[end] = 0;

  let headStart = 0;
  let headEnd = 0;

  while (headStart < qStart.length && headEnd < qEnd.length) {
    // Start
    const u = qStart[headStart++];
    if (distEnd[u] !== -1) return distStart[u] + distEnd[u];

    for (const v of adj[u]) {
      if (distStart[v] === -1) {
        distStart[v] = distStart[u] + 1;
        if (distEnd[v] !== -1) return distStart[v] + distEnd[v];
        qStart.push(v);
      }
    }

    // End
    const w = qEnd[headEnd++];
    if (distStart[w] !== -1) return distStart[w] + distEnd[w];

    for (const v of adj[w]) {
      if (distEnd[v] === -1) {
        distEnd[v] = distEnd[w] + 1;
        if (distStart[v] !== -1) return distStart[v] + distEnd[v];
        qEnd.push(v);
      }
    }
  }

  return -1;
}
