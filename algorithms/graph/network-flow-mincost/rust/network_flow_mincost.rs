use std::collections::VecDeque;

pub fn network_flow_mincost(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let src = arr[2] as usize;
    let sink = arr[3] as usize;

    let mut head = vec![-1i32; n];
    let mut to = Vec::new();
    let mut cap = Vec::new();
    let mut cost_v = Vec::new();
    let mut nxt = Vec::new();
    let mut edge_cnt = 0i32;

    let mut add_edge = |head: &mut Vec<i32>, to: &mut Vec<usize>, cap: &mut Vec<i32>,
                        cost_v: &mut Vec<i32>, nxt: &mut Vec<i32>, edge_cnt: &mut i32,
                        u: usize, v: usize, c: i32, w: i32| {
        to.push(v); cap.push(c); cost_v.push(w); nxt.push(head[u]); head[u] = *edge_cnt; *edge_cnt += 1;
        to.push(u); cap.push(0); cost_v.push(-w); nxt.push(head[v]); head[v] = *edge_cnt; *edge_cnt += 1;
    };

    for i in 0..m {
        let u = arr[4 + 4 * i] as usize;
        let v = arr[4 + 4 * i + 1] as usize;
        let c = arr[4 + 4 * i + 2];
        let w = arr[4 + 4 * i + 3];
        add_edge(&mut head, &mut to, &mut cap, &mut cost_v, &mut nxt, &mut edge_cnt, u, v, c, w);
    }

    let inf = i32::MAX / 2;
    let mut total_cost = 0i32;

    loop {
        let mut dist = vec![inf; n];
        dist[src] = 0;
        let mut in_queue = vec![false; n];
        let mut prev_edge = vec![-1i32; n];
        let mut prev_node = vec![0usize; n];
        let mut q = VecDeque::new();
        q.push_back(src);
        in_queue[src] = true;

        while let Some(u) = q.pop_front() {
            in_queue[u] = false;
            let mut e = head[u];
            while e != -1 {
                let ei = e as usize;
                let v = to[ei];
                if cap[ei] > 0 && dist[u] + cost_v[ei] < dist[v] {
                    dist[v] = dist[u] + cost_v[ei];
                    prev_edge[v] = e;
                    prev_node[v] = u;
                    if !in_queue[v] {
                        q.push_back(v);
                        in_queue[v] = true;
                    }
                }
                e = nxt[ei];
            }
        }

        if dist[sink] == inf { break; }

        let mut bottleneck = inf;
        let mut v = sink;
        while v != src {
            let ei = prev_edge[v] as usize;
            bottleneck = bottleneck.min(cap[ei]);
            v = prev_node[v];
        }

        v = sink;
        while v != src {
            let ei = prev_edge[v] as usize;
            cap[ei] -= bottleneck;
            cap[ei ^ 1] += bottleneck;
            v = prev_node[v];
        }

        total_cost += bottleneck * dist[sink];
    }

    total_cost
}
