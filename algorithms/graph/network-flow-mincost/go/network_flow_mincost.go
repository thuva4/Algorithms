package networkflowmincost

import "math"

func NetworkFlowMincost(arr []int) int {
	n := arr[0]
	m := arr[1]
	src := arr[2]
	sink := arr[3]

	head := make([]int, n)
	for i := range head {
		head[i] = -1
	}
	var to, cap, cost, nxt []int
	edgeCnt := 0

	addEdge := func(u, v, c, w int) {
		to = append(to, v); cap = append(cap, c); cost = append(cost, w)
		nxt = append(nxt, head[u]); head[u] = edgeCnt; edgeCnt++
		to = append(to, u); cap = append(cap, 0); cost = append(cost, -w)
		nxt = append(nxt, head[v]); head[v] = edgeCnt; edgeCnt++
	}

	for i := 0; i < m; i++ {
		u := arr[4+4*i]
		v := arr[4+4*i+1]
		c := arr[4+4*i+2]
		w := arr[4+4*i+3]
		addEdge(u, v, c, w)
	}

	INF := math.MaxInt32 / 2
	totalCost := 0

	for {
		dist := make([]int, n)
		for i := range dist {
			dist[i] = INF
		}
		dist[src] = 0
		inQueue := make([]bool, n)
		prevEdge := make([]int, n)
		prevNode := make([]int, n)
		for i := range prevEdge {
			prevEdge[i] = -1
		}
		q := []int{src}
		inQueue[src] = true

		for len(q) > 0 {
			u := q[0]
			q = q[1:]
			inQueue[u] = false
			for e := head[u]; e != -1; e = nxt[e] {
				v := to[e]
				if cap[e] > 0 && dist[u]+cost[e] < dist[v] {
					dist[v] = dist[u] + cost[e]
					prevEdge[v] = e
					prevNode[v] = u
					if !inQueue[v] {
						q = append(q, v)
						inQueue[v] = true
					}
				}
			}
		}

		if dist[sink] == INF {
			break
		}

		bottleneck := INF
		for v := sink; v != src; v = prevNode[v] {
			if cap[prevEdge[v]] < bottleneck {
				bottleneck = cap[prevEdge[v]]
			}
		}

		for v := sink; v != src; v = prevNode[v] {
			e := prevEdge[v]
			cap[e] -= bottleneck
			cap[e^1] += bottleneck
		}

		totalCost += bottleneck * dist[sink]
	}

	return totalCost
}
