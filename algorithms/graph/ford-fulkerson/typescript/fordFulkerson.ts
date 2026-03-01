let capFF: number[][];
let nFF: number;

function dfsFF(u: number, sink: number, flow: number, visited: boolean[]): number {
    if (u === sink) return flow;
    visited[u] = true;
    for (let v = 0; v < nFF; v++) {
        if (!visited[v] && capFF[u][v] > 0) {
            const d = dfsFF(v, sink, Math.min(flow, capFF[u][v]), visited);
            if (d > 0) { capFF[u][v] -= d; capFF[v][u] += d; return d; }
        }
    }
    return 0;
}

export function fordFulkerson(arr: number[]): number {
    nFF = arr[0]; const m = arr[1]; const src = arr[2]; const sink = arr[3];
    capFF = Array.from({ length: nFF }, () => new Array(nFF).fill(0));
    for (let i = 0; i < m; i++) capFF[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i];
    let maxFlow = 0;
    while (true) {
        const visited = new Array(nFF).fill(false);
        const flow = dfsFF(src, sink, Infinity, visited);
        if (flow === 0) break;
        maxFlow += flow;
    }
    return maxFlow;
}
