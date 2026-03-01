export function networkFlowMincost(arr: number[]): number {
    const n = arr[0];
    const m = arr[1];
    const src = arr[2];
    const sink = arr[3];

    const head = new Array(n).fill(-1);
    const to: number[] = [], cap: number[] = [], cost: number[] = [], nxt: number[] = [];
    let edgeCnt = 0;

    function addEdge(u: number, v: number, c: number, w: number) {
        to.push(v); cap.push(c); cost.push(w); nxt.push(head[u]); head[u] = edgeCnt++;
        to.push(u); cap.push(0); cost.push(-w); nxt.push(head[v]); head[v] = edgeCnt++;
    }

    for (let i = 0; i < m; i++) {
        addEdge(arr[4 + 4 * i], arr[4 + 4 * i + 1], arr[4 + 4 * i + 2], arr[4 + 4 * i + 3]);
    }

    const INF = 1e9;
    let totalCost = 0;

    while (true) {
        const dist = new Array(n).fill(INF);
        dist[src] = 0;
        const inQueue = new Array(n).fill(false);
        const prevEdge = new Array(n).fill(-1);
        const prevNode = new Array(n).fill(-1);
        const q: number[] = [src];
        inQueue[src] = true;
        let qi = 0;

        while (qi < q.length) {
            const u = q[qi++];
            inQueue[u] = false;
            for (let e = head[u]; e !== -1; e = nxt[e]) {
                const v = to[e];
                if (cap[e] > 0 && dist[u] + cost[e] < dist[v]) {
                    dist[v] = dist[u] + cost[e];
                    prevEdge[v] = e;
                    prevNode[v] = u;
                    if (!inQueue[v]) {
                        q.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        if (dist[sink] === INF) break;

        let bottleneck = INF;
        for (let v = sink; v !== src; v = prevNode[v]) {
            bottleneck = Math.min(bottleneck, cap[prevEdge[v]]);
        }

        for (let v = sink; v !== src; v = prevNode[v]) {
            const e = prevEdge[v];
            cap[e] -= bottleneck;
            cap[e ^ 1] += bottleneck;
        }

        totalCost += bottleneck * dist[sink];
    }

    return totalCost;
}
