interface Entry {
    node: number;
    heuristic: number;
    path: number[];
}

export function bestFirstSearch(
    adj: Record<number, number[]>,
    start: number,
    goal: number,
    heuristic: Record<number, number>
): number[] {
    if (start === goal) {
        return [start];
    }

    const visited = new Set<number>();
    // Simple priority queue using array with manual min extraction
    const pq: Entry[] = [];

    pq.push({ node: start, heuristic: heuristic[start], path: [start] });

    while (pq.length > 0) {
        // Find entry with minimum heuristic
        let minIndex = 0;
        for (let i = 1; i < pq.length; i++) {
            if (pq[i].heuristic < pq[minIndex].heuristic) {
                minIndex = i;
            }
        }
        const current = pq.splice(minIndex, 1)[0];

        if (current.node === goal) {
            return current.path;
        }

        if (visited.has(current.node)) {
            continue;
        }
        visited.add(current.node);

        const neighbors = adj[current.node] || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                pq.push({
                    node: neighbor,
                    heuristic: heuristic[neighbor],
                    path: [...current.path, neighbor],
                });
            }
        }
    }

    return [];
}

const adj: Record<number, number[]> = { 0: [1, 2], 1: [3], 2: [3], 3: [] };
const heuristic: Record<number, number> = { 0: 6, 1: 3, 2: 4, 3: 0 };
const result = bestFirstSearch(adj, 0, 3, heuristic);
console.log("Path:", result);
