use std::cmp::Reverse;
use std::collections::BinaryHeap;

pub fn prufer_encode(n: i32, edges: &Vec<Vec<i32>>) -> Vec<i32> {
    let node_count = n.max(0) as usize;
    if node_count <= 2 {
        return Vec::new();
    }

    let mut adjacency = vec![Vec::new(); node_count];
    let mut degree = vec![0usize; node_count];
    for edge in edges {
        if edge.len() < 2 {
            continue;
        }
        let u = edge[0] as usize;
        let v = edge[1] as usize;
        if u >= node_count || v >= node_count {
            continue;
        }
        adjacency[u].push(v);
        adjacency[v].push(u);
        degree[u] += 1;
        degree[v] += 1;
    }

    let mut leaves = BinaryHeap::new();
    for (node, &deg) in degree.iter().enumerate() {
        if deg == 1 {
            leaves.push(Reverse(node));
        }
    }

    let mut result = Vec::new();
    for _ in 0..(node_count - 2) {
        let leaf = match leaves.pop() {
            Some(Reverse(node)) => node,
            None => break,
        };

        let mut neighbor = None;
        for &next in &adjacency[leaf] {
            if degree[next] > 0 {
                neighbor = Some(next);
                break;
            }
        }

        let parent = match neighbor {
            Some(node) => node,
            None => break,
        };

        result.push(parent as i32);
        degree[leaf] = 0;
        degree[parent] -= 1;
        if degree[parent] == 1 {
            leaves.push(Reverse(parent));
        }
    }

    result
}
