export function centroidTree(arr: number[]): number {
  if (arr.length < 1) return 0;
  const n = arr[0];

  if (n <= 1) return 0;
  if (arr.length < 1 + 2 * (n - 1)) return 0;

  const adj: number[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < n - 1; i++) {
    const u = arr[1 + 2 * i];
    const v = arr[1 + 2 * i + 1];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  const sz: number[] = new Array(n).fill(0);
  const removed: boolean[] = new Array(n).fill(false);
  let maxDepth = 0;

  function getSize(u: number, p: number): void {
    sz[u] = 1;
    for (const v of adj[u]) {
      if (v !== p && !removed[v]) {
        getSize(v, u);
        sz[u] += sz[v];
      }
    }
  }

  function getCentroid(u: number, p: number, total: number): number {
    for (const v of adj[u]) {
      if (v !== p && !removed[v] && sz[v] > total / 2) {
        return getCentroid(v, u, total);
      }
    }
    return u;
  }

  function decompose(u: number, depth: number): void {
    getSize(u, -1);
    const total = sz[u];
    const centroid = getCentroid(u, -1, total);

    if (depth > maxDepth) {
      maxDepth = depth;
    }

    removed[centroid] = true;

    for (const v of adj[centroid]) {
      if (!removed[v]) {
        decompose(v, depth + 1);
      }
    }
  }

  decompose(0, 0);

  return maxDepth;
}
