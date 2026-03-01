use std::cmp::min;

struct TarjanContext {
    timer: usize,
    scc_cnt: usize,
    dfn: Vec<usize>,
    low: Vec<usize>,
    scc_id: Vec<usize>,
    in_stack: Vec<bool>,
    stack: Vec<usize>,
}

impl TarjanContext {
    fn new(n: usize) -> Self {
        TarjanContext {
            timer: 0,
            scc_cnt: 0,
            dfn: vec![0; n],
            low: vec![0; n],
            scc_id: vec![0; n],
            in_stack: vec![false; n],
            stack: Vec::new(),
        }
    }
}

fn tarjan(u: usize, adj: &Vec<Vec<usize>>, ctx: &mut TarjanContext) {
    ctx.timer += 1;
    ctx.dfn[u] = ctx.timer;
    ctx.low[u] = ctx.timer;
    ctx.stack.push(u);
    ctx.in_stack[u] = true;

    for &v in &adj[u] {
        if ctx.dfn[v] == 0 {
            tarjan(v, adj, ctx);
            ctx.low[u] = min(ctx.low[u], ctx.low[v]);
        } else if ctx.in_stack[v] {
            ctx.low[u] = min(ctx.low[u], ctx.dfn[v]);
        }
    }

    if ctx.low[u] == ctx.dfn[u] {
        ctx.scc_cnt += 1;
        loop {
            let v = ctx.stack.pop().unwrap();
            ctx.in_stack[v] = false;
            ctx.scc_id[v] = ctx.scc_cnt;
            if u == v {
                break;
            }
        }
    }
}

pub fn two_sat(arr: &[i32]) -> i32 {
    if arr.len() < 2 {
        return 0;
    }
    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 2 * m {
        return 0;
    }

    let num_nodes = 2 * n;
    let mut adj = vec![vec![]; num_nodes];

    for i in 0..m {
        let u_raw = arr[2 + 2 * i];
        let v_raw = arr[2 + 2 * i + 1];

        let u = ((u_raw.abs() - 1) * 2 + if u_raw < 0 { 1 } else { 0 }) as usize;
        let v = ((v_raw.abs() - 1) * 2 + if v_raw < 0 { 1 } else { 0 }) as usize;

        let not_u = u ^ 1;
        let not_v = v ^ 1;

        adj[not_u].push(v);
        adj[not_v].push(u);
    }

    let mut ctx = TarjanContext::new(num_nodes);

    for i in 0..num_nodes {
        if ctx.dfn[i] == 0 {
            tarjan(i, &adj, &mut ctx);
        }
    }

    for i in 0..n {
        if ctx.scc_id[2 * i] == ctx.scc_id[2 * i + 1] {
            return 0;
        }
    }

    1
}
