use std::collections::VecDeque;
use std::i64;

#[derive(Clone)]
struct Edge {
    to: usize,
    rev: usize,
    cap: i64,
    flow: i64,
}

struct Dinic {
    adj: Vec<Vec<Edge>>,
    level: Vec<i32>,
    ptr: Vec<usize>,
    n: usize,
}

impl Dinic {
    fn new(n: usize) -> Self {
        Dinic {
            adj: vec![Vec::new(); n],
            level: vec![-1; n],
            ptr: vec![0; n],
            n,
        }
    }

    fn add_edge(&mut self, u: usize, v: usize, cap: i64) {
        let rev_u = self.adj[v].len();
        let rev_v = self.adj[u].len();
        self.adj[u].push(Edge { to: v, rev: rev_u, cap, flow: 0 });
        self.adj[v].push(Edge { to: u, rev: rev_v, cap: 0, flow: 0 });
    }

    fn bfs(&mut self, s: usize, t: usize) -> bool {
        self.level.fill(-1);
        self.level[s] = 0;
        let mut q = VecDeque::new();
        q.push_back(s);

        while let Some(u) = q.pop_front() {
            for e in &self.adj[u] {
                if e.cap - e.flow > 0 && self.level[e.to] == -1 {
                    self.level[e.to] = self.level[u] + 1;
                    q.push_back(e.to);
                }
            }
        }
        self.level[t] != -1
    }

    fn dfs(&mut self, u: usize, t: usize, pushed: i64) -> i64 {
        if pushed == 0 {
            return 0;
        }
        if u == t {
            return pushed;
        }

        while self.ptr[u] < self.adj[u].len() {
            let cid = self.ptr[u];
            let v = self.adj[u][cid].to;
            
            // Need to check conditions before borrowing mutable
            let valid = self.level[u] + 1 == self.level[v] && self.adj[u][cid].cap - self.adj[u][cid].flow > 0;
            
            if !valid {
                self.ptr[u] += 1;
                continue;
            }

            let tr = pushed.min(self.adj[u][cid].cap - self.adj[u][cid].flow);
            let pushed_flow = self.dfs(v, t, tr);

            if pushed_flow == 0 {
                self.ptr[u] += 1;
                continue;
            }

            self.adj[u][cid].flow += pushed_flow;
            let rev = self.adj[u][cid].rev;
            self.adj[v][rev].flow -= pushed_flow;

            return pushed_flow;
        }
        0
    }
}

pub fn dinic(arr: &[i32]) -> i32 {
    if arr.len() < 4 {
        return 0;
    }
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let s = arr[2] as usize;
    let t = arr[3] as usize;

    if arr.len() < 4 + 3 * m {
        return 0;
    }

    let mut graph = Dinic::new(n);
    for i in 0..m {
        let u = arr[4 + 3 * i] as usize;
        let v = arr[4 + 3 * i + 1] as usize;
        let cap = arr[4 + 3 * i + 2] as i64;
        if u < n && v < n {
            graph.add_edge(u, v, cap);
        }
    }

    let mut flow = 0;
    while graph.bfs(s, t) {
        graph.ptr.fill(0);
        loop {
            let pushed = graph.dfs(s, t, i64::MAX);
            if pushed == 0 {
                break;
            }
            flow += pushed;
        }
    }

    flow as i32
}
