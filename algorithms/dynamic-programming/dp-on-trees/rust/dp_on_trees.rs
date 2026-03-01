use std::io::{self, Read};
use std::collections::VecDeque;

fn dp_on_trees_impl(n: usize, values: &[i64], edges: &[(usize, usize)]) -> i64 {
    if n == 0 { return 0; }
    if n == 1 { return values[0]; }

    let mut adj: Vec<Vec<usize>> = vec![vec![]; n];
    for &(u, v) in edges {
        adj[u].push(v);
        adj[v].push(u);
    }

    let mut dp = vec![0i64; n];
    let mut parent = vec![usize::MAX; n];
    let mut visited = vec![false; n];

    let mut order = Vec::with_capacity(n);
    let mut queue = VecDeque::new();
    queue.push_back(0);
    visited[0] = true;
    while let Some(node) = queue.pop_front() {
        order.push(node);
        for &child in &adj[node] {
            if !visited[child] {
                visited[child] = true;
                parent[child] = node;
                queue.push_back(child);
            }
        }
    }

    for i in (0..order.len()).rev() {
        let node = order[i];
        let mut best_child: i64 = 0;
        for &child in &adj[node] {
            if child != parent[node] {
                best_child = best_child.max(dp[child]);
            }
        }
        dp[node] = values[node] + best_child;
    }

    *dp.iter().max().unwrap()
}

pub fn dp_on_trees(n: usize, values: &Vec<i64>, edges: &Vec<Vec<usize>>) -> i64 {
    let parsed: Vec<(usize, usize)> = edges
        .iter()
        .filter(|edge| edge.len() >= 2)
        .map(|edge| (edge[0], edge[1]))
        .collect();
    dp_on_trees_impl(n, values, &parsed)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();
    let n: usize = iter.next().unwrap().parse().unwrap();
    let values: Vec<i64> = (0..n).map(|_| iter.next().unwrap().parse().unwrap()).collect();
    let mut edges = Vec::new();
    for _ in 0..n.saturating_sub(1) {
        let u: usize = iter.next().unwrap().parse().unwrap();
        let v: usize = iter.next().unwrap().parse().unwrap();
        edges.push((u, v));
    }
    println!("{}", dp_on_trees_impl(n, &values, &edges));
}
