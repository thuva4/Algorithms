export function topologicalSortKahn(arr: number[]): number[] {
    if (arr.length < 2) {
        return [];
    }

    const numVertices = arr[0];
    const numEdges = arr[1];

    const adj: number[][] = Array.from({ length: numVertices }, () => []);
    const inDegree = new Array(numVertices).fill(0);

    for (let i = 0; i < numEdges; i++) {
        const u = arr[2 + 2 * i];
        const v = arr[2 + 2 * i + 1];
        adj[u].push(v);
        inDegree[v]++;
    }

    const queue: number[] = [];
    for (let v = 0; v < numVertices; v++) {
        if (inDegree[v] === 0) {
            queue.push(v);
        }
    }

    const result: number[] = [];
    let front = 0;
    while (front < queue.length) {
        const u = queue[front++];
        result.push(u);
        for (const v of adj[u]) {
            inDegree[v]--;
            if (inDegree[v] === 0) {
                queue.push(v);
            }
        }
    }

    if (result.length === numVertices) {
        return result;
    }
    return [];
}
