use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashMap};

#[derive(Copy, Clone, Eq, PartialEq)]
struct State {
    cost: i32,
    position: usize,
}

// The priority queue depends on `Ord`.
// Explicitly implement the trait so the queue becomes a min-heap
// instead of a max-heap.
impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        // Notice that the we flip the ordering on costs.
        // In case of a tie we compare positions - this step is necessary
        // to make implementations of `PartialEq` and `Ord` consistent.
        other.cost.cmp(&self.cost)
            .then_with(|| self.position.cmp(&other.position))
    }
}

// `PartialOrd` needs to be implemented as well.
impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

pub fn best_first_search(
    adjacency_list: &HashMap<usize, Vec<usize>>,
    start: usize,
    target: usize,
    heuristic_values: &HashMap<usize, i32>,
) -> Vec<usize> {
    let n = adjacency_list.keys().max().copied().unwrap_or(0) + 1;
    let mut adj = vec![Vec::new(); n];
    for (&node, neighbors) in adjacency_list {
        if node < n {
            adj[node] = neighbors.clone();
        }
    }
    let mut heuristic = vec![0; n];
    for (&node, &value) in heuristic_values {
        if node < n {
            heuristic[node] = value;
        }
    }

    let mut pq = BinaryHeap::new();
    let mut visited = vec![false; n];
    let mut parent = vec![usize::MAX; n];

    pq.push(State { cost: heuristic[start], position: start });
    visited[start] = true;

    let mut found = false;

    while let Some(State { cost: _, position: u }) = pq.pop() {
        if u == target {
            found = true;
            break;
        }

        for &v in &adj[u] {
            if !visited[v] {
                visited[v] = true;
                parent[v] = u;
                pq.push(State { cost: heuristic[v], position: v });
            }
        }
    }

    let mut path = Vec::new();
    if found {
        let mut curr = target;
        while curr != usize::MAX {
            path.push(curr);
            curr = parent[curr];
        }
        path.reverse();
    }
    path
}
