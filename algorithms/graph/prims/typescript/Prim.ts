/**
 * Prim's algorithm to find MST total weight.
 * @param numVertices - Number of vertices
 * @param adjList - Weighted adjacency list where each entry is [neighbor, weight]
 * @returns Total weight of the MST
 */
export function prim(numVertices: number, adjList: Record<string, number[][]>): number {
    const inMST: boolean[] = new Array(numVertices).fill(false);
    const key: number[] = new Array(numVertices).fill(Infinity);
    key[0] = 0;

    let totalWeight = 0;

    for (let count = 0; count < numVertices; count++) {
        // Find minimum key vertex not in MST
        let u = -1;
        let minKey = Infinity;
        for (let i = 0; i < numVertices; i++) {
            if (!inMST[i] && key[i] < minKey) {
                minKey = key[i];
                u = i;
            }
        }

        if (u === -1) break;

        inMST[u] = true;
        totalWeight += key[u];

        // Update keys of adjacent vertices
        const neighbors = adjList[u.toString()] || [];
        for (const [v, w] of neighbors) {
            if (!inMST[v] && w < key[v]) {
                key[v] = w;
            }
        }
    }

    return totalWeight;
}

// Example usage
const adjList = {
    "0": [[1, 10], [2, 6], [3, 5]],
    "1": [[0, 10], [3, 15]],
    "2": [[0, 6], [3, 4]],
    "3": [[0, 5], [1, 15], [2, 4]]
};

const result = prim(4, adjList);
console.log("MST total weight:", result);
