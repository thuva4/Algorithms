pub fn kosarajus_scc(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj = vec![vec![]; n];
    let mut radj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
        radj[v].push(u);
    }

    let mut visited = vec![false; n];
    let mut order = Vec::new();

    fn dfs1(v: usize, adj: &Vec<Vec<usize>>, visited: &mut Vec<bool>, order: &mut Vec<usize>) {
        visited[v] = true;
        for &w in &adj[v] {
            if !visited[w] {
                dfs1(w, adj, visited, order);
            }
        }
        order.push(v);
    }

    fn dfs2(v: usize, radj: &Vec<Vec<usize>>, visited: &mut Vec<bool>) {
        visited[v] = true;
        for &w in &radj[v] {
            if !visited[w] {
                dfs2(w, radj, visited);
            }
        }
    }

    for v in 0..n {
        if !visited[v] {
            dfs1(v, &adj, &mut visited, &mut order);
        }
    }

    visited.fill(false);
    let mut scc_count = 0;

    for i in (0..order.len()).rev() {
        let v = order[i];
        if !visited[v] {
            dfs2(v, &radj, &mut visited);
            scc_count += 1;
        }
    }

    scc_count
}
