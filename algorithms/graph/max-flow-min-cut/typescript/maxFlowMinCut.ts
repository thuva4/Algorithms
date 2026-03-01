export function maxFlowMinCut(arr: number[]): number {
    const n = arr[0], m = arr[1], src = arr[2], sink = arr[3];
    const cap: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < m; i++) cap[arr[4+3*i]][arr[5+3*i]] += arr[6+3*i];
    let maxFlow = 0;
    while (true) {
        const parent = new Array(n).fill(-1);
        parent[src] = src;
        const queue = [src];
        let front = 0;
        while (front < queue.length && parent[sink] === -1) {
            const u = queue[front++];
            for (let v = 0; v < n; v++)
                if (parent[v] === -1 && cap[u][v] > 0) { parent[v] = u; queue.push(v); }
        }
        if (parent[sink] === -1) break;
        let flow = Infinity;
        for (let v = sink; v !== src; v = parent[v]) flow = Math.min(flow, cap[parent[v]][v]);
        for (let v = sink; v !== src; v = parent[v]) { cap[parent[v]][v] -= flow; cap[v][parent[v]] += flow; }
        maxFlow += flow;
    }
    return maxFlow;
}
