interface HeapNode {
  id: number;
  g: number;
  f: number;
}

export function aStarSearch(arr: number[]): number {
  if (arr.length < 2) {
    return -1;
  }

  const n = arr[0];
  const m = arr[1];
  if (arr.length < 2 + 3 * m + 2 + n) {
    return -1;
  }

  const adj: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
  for (let i = 0; i < m; i += 1) {
    const u = arr[2 + 3 * i];
    const v = arr[2 + 3 * i + 1];
    const w = arr[2 + 3 * i + 2];
    adj[u].push([v, w]);
  }

  const start = arr[2 + 3 * m];
  const goal = arr[2 + 3 * m + 1];
  const heuristics = arr.slice(2 + 3 * m + 2, 2 + 3 * m + 2 + n);

  const best = new Array(n).fill(Number.MAX_SAFE_INTEGER);
  best[start] = 0;
  const queue: HeapNode[] = [{ id: start, g: 0, f: heuristics[start] ?? 0 }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.f - b.f);
    const current = queue.shift();
    if (!current) {
      break;
    }
    if (current.id === goal) {
      return current.g;
    }
    if (current.g > best[current.id]) {
      continue;
    }

    for (const [next, weight] of adj[current.id]) {
      const nextG = current.g + weight;
      if (nextG < best[next]) {
        best[next] = nextG;
        queue.push({ id: next, g: nextG, f: nextG + (heuristics[next] ?? 0) });
      }
    }
  }

  return -1;
}
