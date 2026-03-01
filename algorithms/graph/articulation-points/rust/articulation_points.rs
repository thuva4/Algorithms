use std::cmp::min;

struct DfsContext {
    timer: usize,
    dfn: Vec<usize>,
    low: Vec<usize>,
    is_ap: Vec<bool>,
}

impl DfsContext {
    fn new(n: usize) -> Self {
        DfsContext {
            timer: 0,
            dfn: vec![0; n],
            low: vec![0; n],
            is_ap: vec![false; n],
        }
    }
}

fn dfs(u: usize, p: isize, adj: &Vec<Vec<usize>>, ctx: &mut DfsContext) {
    ctx.timer += 1;
    ctx.dfn[u] = ctx.timer;
    ctx.low[u] = ctx.timer;
    let mut children = 0;

    for &v in &adj[u] {
        if v as isize == p {
            continue;
        }
        if ctx.dfn[v] != 0 {
            ctx.low[u] = min(ctx.low[u], ctx.dfn[v]);
        } else {
            children += 1;
            dfs(v, u as isize, adj, ctx);
            ctx.low[u] = min(ctx.low[u], ctx.low[v]);
            if p != -1 && ctx.low[v] >= ctx.dfn[u] {
                ctx.is_ap[u] = true;
            }
        }
    }

    if p == -1 && children > 1 {
        ctx.is_ap[u] = true;
    }
}

pub fn articulation_points(arr: &[i32]) -> i32 {
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

    let mut count = 0;
    for &ap in &ctx.is_ap {
        if ap {
            count += 1;
        }
    }
    count
}
