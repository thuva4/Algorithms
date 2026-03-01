/**
 * Kosaraju's algorithm to find strongly connected components.
 * @param adjList - Adjacency list representation
 * @returns Array of SCCs, each SCC is an array of node numbers
 */
export function findSccs(adjList: Record<string, number[]>): number[][] {
    const numNodes = Object.keys(adjList).length;
    const visited = new Set<number>();
    const finishOrder: number[] = [];

    function dfs1(node: number): void {
        visited.add(node);
        for (const neighbor of adjList[node.toString()] || []) {
            if (!visited.has(neighbor)) {
                dfs1(neighbor);
            }
        }
        finishOrder.push(node);
    }

    for (let i = 0; i < numNodes; i++) {
        if (!visited.has(i)) dfs1(i);
    }

    // Build reverse graph
    const revAdj: Record<string, number[]> = {};
    for (const node of Object.keys(adjList)) {
        revAdj[node] = [];
    }
    for (const [node, neighbors] of Object.entries(adjList)) {
        for (const neighbor of neighbors) {
            if (!revAdj[neighbor.toString()]) revAdj[neighbor.toString()] = [];
            revAdj[neighbor.toString()].push(parseInt(node));
        }
    }

    // Second DFS pass on reversed graph
    visited.clear();
    const components: number[][] = [];

    function dfs2(node: number, component: number[]): void {
        visited.add(node);
        component.push(node);
        for (const neighbor of revAdj[node.toString()] || []) {
            if (!visited.has(neighbor)) {
                dfs2(neighbor, component);
            }
        }
    }

    for (let i = finishOrder.length - 1; i >= 0; i--) {
        const node = finishOrder[i];
        if (!visited.has(node)) {
            const component: number[] = [];
            dfs2(node, component);
            component.sort((a, b) => a - b);  // Sort each component for consistent ordering
            components.push(component);
        }
    }

    components.sort((a, b) => a[0] - b[0]);  // Sort components by their first element
    return components;
}

// Example usage
const adjList = {
    "0": [1],
    "1": [2],
    "2": [0, 3],
    "3": [4],
    "4": [3]
};

const components = findSccs(adjList);
console.log("SCCs:", components);
