interface QueueEntry {
  node: number;
  path: number[];
}

export function bestFirstSearch(
  adjacencyList: Record<number, number[]>,
  start: number,
  goal: number,
  heuristic: Record<number, number>,
): number[] {
  if (start === goal) {
    return [start];
  }

  const visited = new Set<number>();
  const queue: QueueEntry[] = [{ node: start, path: [start] }];

  while (queue.length > 0) {
    queue.sort((a, b) => (heuristic[a.node] ?? Number.MAX_SAFE_INTEGER) - (heuristic[b.node] ?? Number.MAX_SAFE_INTEGER));
    const current = queue.shift();
    if (!current) {
      break;
    }
    if (visited.has(current.node)) {
      continue;
    }
    visited.add(current.node);

    for (const neighbor of adjacencyList[current.node] ?? []) {
      const nextPath = [...current.path, neighbor];
      if (neighbor === goal) {
        return nextPath;
      }
      if (!visited.has(neighbor)) {
        queue.push({ node: neighbor, path: nextPath });
      }
    }
  }

  return [];
}
