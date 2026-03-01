export function twoSat(arr: number[]): number {
  if (arr.length < 2) return 0;
  const n = arr[0];
  const m = arr[1];

  if (arr.length < 2 + 2 * m) return 0;

  const numNodes = 2 * n;
  const adj: number[][] = Array.from({ length: numNodes }, () => []);

  for (let i = 0; i < m; i++) {
    const uRaw = arr[2 + 2 * i];
    const vRaw = arr[2 + 2 * i + 1];

    const u = (Math.abs(uRaw) - 1) * 2 + (uRaw < 0 ? 1 : 0);
    const v = (Math.abs(vRaw) - 1) * 2 + (vRaw < 0 ? 1 : 0);

    const notU = u ^ 1;
    const notV = v ^ 1;

    adj[notU].push(v);
    adj[notV].push(u);
  }

  const dfn: number[] = new Array(numNodes).fill(0);
  const low: number[] = new Array(numNodes).fill(0);
  const sccId: number[] = new Array(numNodes).fill(0);
  const inStack: boolean[] = new Array(numNodes).fill(false);
  const stack: number[] = [];
  let timer = 0;
  let sccCnt = 0;

  function tarjan(u: number): void {
    timer++;
    dfn[u] = low[u] = timer;
    stack.push(u);
    inStack[u] = true;

    for (const v of adj[u]) {
      if (dfn[v] === 0) {
        tarjan(v);
        low[u] = Math.min(low[u], low[v]);
      } else if (inStack[v]) {
        low[u] = Math.min(low[u], dfn[v]);
      }
    }

    if (low[u] === dfn[u]) {
      sccCnt++;
      let v;
      do {
        v = stack.pop()!;
        inStack[v] = false;
        sccId[v] = sccCnt;
      } while (u !== v);
    }
  }

  for (let i = 0; i < numNodes; i++) {
    if (dfn[i] === 0) tarjan(i);
  }

  for (let i = 0; i < n; i++) {
    if (sccId[2 * i] === sccId[2 * i + 1]) return 0;
  }

  return 1;
}
