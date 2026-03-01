pub fn tree_diameter(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let n = arr[idx] as usize; idx += 1;
    if n <= 1 { return 0; }

    let mut adj: Vec<Vec<usize>> = vec![vec![]; n];
    let m = (arr.len() - 1) / 2;
    for _ in 0..m {
        let u = arr[idx] as usize; idx += 1;
        let v = arr[idx] as usize; idx += 1;
        adj[u].push(v);
        adj[v].push(u);
    }

    fn bfs(start: usize, n: usize, adj: &[Vec<usize>]) -> (usize, i32) {
        let mut dist = vec![-1i32; n];
        dist[start] = 0;
        let mut queue = std::collections::VecDeque::new();
        queue.push_back(start);
        let mut farthest = start;
        while let Some(node) = queue.pop_front() {
            for &nb in &adj[node] {
                if dist[nb] == -1 {
                    dist[nb] = dist[node] + 1;
                    queue.push_back(nb);
                    if dist[nb] > dist[farthest] { farthest = nb; }
                }
            }
        }
        (farthest, dist[farthest])
    }

    let (u, _) = bfs(0, n, &adj);
    let (_, diameter) = bfs(u, n, &adj);
    diameter
}

fn main() {
    println!("{}", tree_diameter(&[4, 0, 1, 1, 2, 2, 3]));
    println!("{}", tree_diameter(&[5, 0, 1, 0, 2, 0, 3, 0, 4]));
    println!("{}", tree_diameter(&[2, 0, 1]));
    println!("{}", tree_diameter(&[1]));
}
