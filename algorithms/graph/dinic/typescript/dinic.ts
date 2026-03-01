class Edge {
  to: number;
  rev: number;
  cap: number;
  flow: number;

  constructor(to: number, rev: number, cap: number) {
    this.to = to;
    this.rev = rev;
    this.cap = cap;
    this.flow = 0;
  }
}

export function dinic(arr: number[]): number {
  if (arr.length < 4) return 0;
  const n = arr[0];
  const m = arr[1];
  const s = arr[2];
  const t = arr[3];

  if (arr.length < 4 + 3 * m) return 0;

  const adj: Edge[][] = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i++) {
    const u = arr[4 + 3 * i];
    const v = arr[4 + 3 * i + 1];
    const cap = arr[4 + 3 * i + 2];
    if (u >= 0 && u < n && v >= 0 && v < n) {
      const a = new Edge(v, adj[v].length, cap);
      const b = new Edge(u, adj[u].length, 0);
      adj[u].push(a);
      adj[v].push(b);
    }
  }

  const level: number[] = new Array(n).fill(-1);
  const ptr: number[] = new Array(n).fill(0);

  function bfs(): boolean {
    level.fill(-1);
    level[s] = 0;
    const q: number[] = [s];
    let head = 0;

    while (head < q.length) {
      const u = q[head++];
      for (const e of adj[u]) {
        if (e.cap - e.flow > 0 && level[e.to] === -1) {
          level[e.to] = level[u] + 1;
          q.push(e.to);
        }
      }
    }
    return level[t] !== -1;
  }

  function dfs(u: number, pushed: number): number {
    if (pushed === 0) return 0;
    if (u === t) return pushed;

    for (; ptr[u] < adj[u].length; ptr[u]++) {
      const id = ptr[u];
      const e = adj[u][id];
      const v = e.to;

      if (level[u] + 1 !== level[v] || e.cap - e.flow === 0) {
        continue;
      }

      const tr = pushed;
      const actualPushed = e.cap - e.flow < tr ? e.cap - e.flow : tr;

      const pushedFlow = dfs(v, actualPushed);
      if (pushedFlow === 0) {
        continue;
      }

      e.flow += pushedFlow;
      adj[v][e.rev].flow -= pushedFlow;

      return pushedFlow;
    }
    return 0;
  }

  let flow = 0;
  while (bfs()) {
    ptr.fill(0);
    while (true) {
      const pushed = dfs(s, Number.MAX_SAFE_INTEGER);
      if (pushed === 0) break;
      flow += pushed;
    }
  }

  return flow;
}
