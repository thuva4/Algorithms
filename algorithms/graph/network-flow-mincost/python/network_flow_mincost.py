from collections import deque

def network_flow_mincost(arr: list[int]) -> int:
    n = arr[0]
    m = arr[1]
    src = arr[2]
    sink = arr[3]

    head = [-1] * n
    to = []
    cap = []
    cost = []
    nxt = []
    edge_cnt = 0

    def add_edge(u, v, c, w):
        nonlocal edge_cnt
        to.append(v); cap.append(c); cost.append(w); nxt.append(head[u]); head[u] = edge_cnt; edge_cnt += 1
        to.append(u); cap.append(0); cost.append(-w); nxt.append(head[v]); head[v] = edge_cnt; edge_cnt += 1

    for i in range(m):
        u = arr[4 + 4 * i]
        v = arr[4 + 4 * i + 1]
        c = arr[4 + 4 * i + 2]
        w = arr[4 + 4 * i + 3]
        add_edge(u, v, c, w)

    total_cost = 0
    INF = float('inf')

    while True:
        dist = [INF] * n
        dist[src] = 0
        in_queue = [False] * n
        prev_edge = [-1] * n
        prev_node = [-1] * n
        q = deque([src])
        in_queue[src] = True

        while q:
            u = q.popleft()
            in_queue[u] = False
            e = head[u]
            while e != -1:
                v = to[e]
                if cap[e] > 0 and dist[u] + cost[e] < dist[v]:
                    dist[v] = dist[u] + cost[e]
                    prev_edge[v] = e
                    prev_node[v] = u
                    if not in_queue[v]:
                        q.append(v)
                        in_queue[v] = True
                e = nxt[e]

        if dist[sink] == INF:
            break

        # Find bottleneck
        bottleneck = INF
        v = sink
        while v != src:
            e = prev_edge[v]
            bottleneck = min(bottleneck, cap[e])
            v = prev_node[v]

        # Push flow
        v = sink
        while v != src:
            e = prev_edge[v]
            cap[e] -= bottleneck
            cap[e ^ 1] += bottleneck
            v = prev_node[v]

        total_cost += bottleneck * dist[sink]

    return total_cost
