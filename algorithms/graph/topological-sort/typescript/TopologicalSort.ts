export function topologicalSort(adjList: Record<string, number[]>): number[] {
    const nodes = Object.keys(adjList).map(Number).sort((a, b) => a - b);
    const inDegree = new Map<number, number>();

    for (const node of nodes) {
        inDegree.set(node, 0);
    }

    for (const node of nodes) {
        for (const neighbor of adjList[node.toString()] || []) {
            inDegree.set(neighbor, (inDegree.get(neighbor) ?? 0) + 1);
        }
    }

    const queue = nodes.filter((node) => (inDegree.get(node) ?? 0) === 0);
    const order: number[] = [];

    while (queue.length > 0) {
        queue.sort((a, b) => a - b);
        const node = queue.shift()!;
        order.push(node);

        for (const neighbor of adjList[node.toString()] || []) {
            const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
            inDegree.set(neighbor, nextDegree);
            if (nextDegree === 0) {
                queue.push(neighbor);
            }
        }
    }

    return order;
}
