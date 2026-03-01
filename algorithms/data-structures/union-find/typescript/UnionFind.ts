type UnionFindOperation =
  | { type: 'union'; a: number; b: number }
  | { type: 'find'; a: number; b: number };

class UnionFind {
  private readonly parent: number[];
  private readonly rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, index) => index);
    this.rank = new Array(n).fill(0);
  }

  find(node: number): number {
    if (this.parent[node] !== node) {
      this.parent[node] = this.find(this.parent[node]);
    }

    return this.parent[node];
  }

  union(a: number, b: number): void {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA === rootB) {
      return;
    }

    if (this.rank[rootA] < this.rank[rootB]) {
      this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
      this.parent[rootB] = rootA;
    } else {
      this.parent[rootB] = rootA;
      this.rank[rootA] += 1;
    }
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}

export function unionFindOperations(
  n: number,
  operations: UnionFindOperation[],
): boolean[] {
  const unionFind = new UnionFind(n);
  const results: boolean[] = [];

  for (const operation of operations) {
    if (operation.type === 'union') {
      unionFind.union(operation.a, operation.b);
    } else if (operation.type === 'find') {
      results.push(unionFind.connected(operation.a, operation.b));
    }
  }

  return results;
}

export const unionFind = unionFindOperations;
