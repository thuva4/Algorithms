pub fn count_bridges(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut disc = vec![-1i32; n];
    let mut low = vec![0i32; n];
    let mut parent = vec![-1i32; n];
    let mut timer: i32 = 0;
    let mut bridge_count: i32 = 0;

    fn dfs(
        u: usize, adj: &Vec<Vec<usize>>, disc: &mut Vec<i32>, low: &mut Vec<i32>,
        parent: &mut Vec<i32>, timer: &mut i32, bridge_count: &mut i32,
    ) {
        disc[u] = *timer;
        low[u] = *timer;
        *timer += 1;

        for &v in &adj[u] {
            if disc[v] == -1 {
                parent[v] = u as i32;
                dfs(v, adj, disc, low, parent, timer, bridge_count);
                low[u] = low[u].min(low[v]);
                if low[v] > disc[u] { *bridge_count += 1; }
            } else if v as i32 != parent[u] {
                low[u] = low[u].min(disc[v]);
            }
        }
    }

    for i in 0..n {
        if disc[i] == -1 {
            dfs(i, &adj, &mut disc, &mut low, &mut parent, &mut timer, &mut bridge_count);
        }
    }

    bridge_count
}
