pub fn strongly_connected_path_based(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
    }

    let mut preorder = vec![-1i32; n];
    let mut counter = 0i32;
    let mut s_stack = Vec::new();
    let mut p_stack = Vec::new();
    let mut assigned = vec![false; n];
    let mut scc_count = 0i32;

    fn dfs(
        v: usize, adj: &[Vec<usize>], preorder: &mut [i32], counter: &mut i32,
        s_stack: &mut Vec<usize>, p_stack: &mut Vec<usize>, assigned: &mut [bool], scc_count: &mut i32,
    ) {
        preorder[v] = *counter; *counter += 1;
        s_stack.push(v); p_stack.push(v);

        for &w in &adj[v] {
            if preorder[w] == -1 {
                dfs(w, adj, preorder, counter, s_stack, p_stack, assigned, scc_count);
            } else if !assigned[w] {
                while !p_stack.is_empty() && preorder[*p_stack.last().unwrap()] > preorder[w] {
                    p_stack.pop();
                }
            }
        }

        if !p_stack.is_empty() && *p_stack.last().unwrap() == v {
            p_stack.pop();
            *scc_count += 1;
            loop {
                let u = s_stack.pop().unwrap();
                assigned[u] = true;
                if u == v { break; }
            }
        }
    }

    for v in 0..n {
        if preorder[v] == -1 {
            dfs(v, &adj, &mut preorder, &mut counter, &mut s_stack, &mut p_stack, &mut assigned, &mut scc_count);
        }
    }
    scc_count
}
