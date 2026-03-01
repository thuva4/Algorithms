use std::cmp::min;

struct DfsContext {
    timer: usize,
    dfn: Vec<usize>,
    low: Vec<usize>,
    bridge_count: i32,
}

impl DfsContext {
    fn new(n: usize) -> Self {
        DfsContext {
            timer: 0,
            dfn: vec![0; n],
            low: vec![0; n],
            bridge_count: 0,
        }
    }
}

fn dfs(u: usize, p: isize, adj: &Vec<Vec<usize>>, ctx: &mut DfsContext) {
    ctx.timer += 1;
    ctx.dfn[u] = ctx.timer;
    ctx.low[u] = ctx.timer;

    for &v in &adj[u] {
        if v as isize == p {
            continue;
        }
        if ctx.dfn[v] != 0 {
            ctx.low[u] = min(ctx.low[u], ctx.dfn[v]);
        } else {
            dfs(v, u as isize, adj, ctx);
            ctx.low[u] = min(ctx.low[u], ctx.low[v]);
            if ctx.low[v] > ctx.dfn[u] {
                ctx.bridge_count += 1;
            }
        }
    }
}

pub fn count_bridges(arr: &[i32]) -> i32 {
    if arr.len() < 2 {
        return 0;
    }
    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 2 * m {
        return 0;
    }

    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        if u < n && v < n {
            adj[u].push(v);
            adj[v].push(u);
        }
    }

    let mut ctx = DfsContext::new(n);

    for i in 0..n {
        if ctx.dfn[i] == 0 {
            dfs(i, -1, &adj, &mut ctx);
        }
    }

    ctx.bridge_count
}
