pub fn tarjans_scc(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut adj = vec![vec![]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        adj[u].push(v);
    }

    let mut index_counter: i32 = 0;
    let mut scc_count: i32 = 0;
    let mut disc = vec![-1i32; n];
    let mut low = vec![0i32; n];
    let mut on_stack = vec![false; n];
    let mut stack = Vec::new();

    fn strongconnect(
        v: usize,
        adj: &Vec<Vec<usize>>,
        disc: &mut Vec<i32>,
        low: &mut Vec<i32>,
        on_stack: &mut Vec<bool>,
        stack: &mut Vec<usize>,
        index_counter: &mut i32,
        scc_count: &mut i32,
    ) {
        disc[v] = *index_counter;
        low[v] = *index_counter;
        *index_counter += 1;
        stack.push(v);
        on_stack[v] = true;

        for &w in &adj[v] {
            if disc[w] == -1 {
                strongconnect(w, adj, disc, low, on_stack, stack, index_counter, scc_count);
                low[v] = low[v].min(low[w]);
            } else if on_stack[w] {
                low[v] = low[v].min(disc[w]);
            }
        }

        if low[v] == disc[v] {
            *scc_count += 1;
            loop {
                let w = stack.pop().unwrap();
                on_stack[w] = false;
                if w == v {
                    break;
                }
            }
        }
    }

    for v in 0..n {
        if disc[v] == -1 {
            strongconnect(v, &adj, &mut disc, &mut low, &mut on_stack, &mut stack, &mut index_counter, &mut scc_count);
        }
    }

    scc_count
}
