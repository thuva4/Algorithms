export function hopcroftKarp(arr: number[]): number {
  if (arr.length < 3) return 0;

  const nLeft = arr[0];
  const nRight = arr[1];
  const m = arr[2];

  if (arr.length < 3 + 2 * m) return 0;
  if (nLeft === 0 || nRight === 0) return 0;

  const adj: number[][] = Array.from({ length: nLeft }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[3 + 2 * i];
    const v = arr[3 + 2 * i + 1];
    if (u >= 0 && u < nLeft && v >= 0 && v < nRight) {
      adj[u].push(v);
    }
  }

  const pairU: number[] = new Array(nLeft).fill(-1);
  const pairV: number[] = new Array(nRight).fill(-1);
  const dist: number[] = new Array(nLeft + 1).fill(0);

  function bfs(): boolean {
    const q: number[] = [];
    for (let u = 0; u < nLeft; u++) {
      if (pairU[u] === -1) {
        dist[u] = 0;
        q.push(u);
      } else {
        dist[u] = Number.MAX_SAFE_INTEGER;
      }
    }

    dist[nLeft] = Number.MAX_SAFE_INTEGER;

    let head = 0;
    while (head < q.length) {
      const u = q[head++];

      if (dist[u] < dist[nLeft]) {
        for (const v of adj[u]) {
          const pu = pairV[v];
          if (pu === -1) {
            if (dist[nLeft] === Number.MAX_SAFE_INTEGER) {
              dist[nLeft] = dist[u] + 1;
            }
          } else if (dist[pu] === Number.MAX_SAFE_INTEGER) {
            dist[pu] = dist[u] + 1;
            q.push(pu);
          }
        }
      }
    }

    return dist[nLeft] !== Number.MAX_SAFE_INTEGER;
  }

  function dfs(u: number): boolean {
    if (u !== -1) {
      for (const v of adj[u]) {
        const pu = pairV[v];
        if (pu === -1 || (dist[pu] === dist[u] + 1 && dfs(pu))) {
          pairV[v] = u;
          pairU[u] = v;
          return true;
        }
      }
      dist[u] = Number.MAX_SAFE_INTEGER;
      return false;
    }
    return true;
  }

  let matching = 0;
  while (bfs()) {
    for (let u = 0; u < nLeft; u++) {
      if (pairU[u] === -1 && dfs(u)) {
        matching++;
      }
    }
  }

  return matching;
}
