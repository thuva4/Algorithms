/**
 * Union-Find (Disjoint Set Union) data structure.
 */
class UnionFind {
    private parent: number[];
    private rank: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) return false;

        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        return true;
    }
}

/**
 * Kruskal's algorithm to find MST total weight.
 * @param numVertices - Number of vertices
 * @param edges - List of edges as [src, dest, weight]
 * @returns Total weight of the MST
 */
export function kruskal(numVertices: number, edges: number[][]): number {
    const sortedEdges = [...edges].sort((a, b) => a[2] - b[2]);
    const uf = new UnionFind(numVertices);
    let totalWeight = 0;
    let edgesUsed = 0;

    for (const [src, dest, weight] of sortedEdges) {
        if (edgesUsed >= numVertices - 1) break;

        if (uf.union(src, dest)) {
            totalWeight += weight;
            edgesUsed++;
        }
    }

    return totalWeight;
}

// Example usage
const edges = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]];
const result = kruskal(4, edges);
console.log("MST total weight:", result);
