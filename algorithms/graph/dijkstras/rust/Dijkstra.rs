use std::cmp::Ordering;
use std::collections::BinaryHeap;

const INF: i32 = 1000000000;

#[derive(Copy, Clone, Eq, PartialEq)]
struct State {
    cost: i32,
    position: usize,
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.cmp(&self.cost)
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

#[derive(Clone)]
struct Edge {
    to: usize,
    weight: i32,
}

pub fn dijkstra(arr: &[i32]) -> Vec<i32> {
    if arr.len() < 2 {
        return Vec::new();
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 3 * m + 1 {
        return Vec::new();
    }

    let start = arr[2 + 3 * m] as usize;
    if start >= n {
        return Vec::new();
    }

    let mut adj = vec![Vec::new(); n];
    for i in 0..m {
        let u = arr[2 + 3 * i] as usize;
        let v = arr[2 + 3 * i + 1] as usize;
        let w = arr[2 + 3 * i + 2];
        if u < n && v < n {
            adj[u].push(Edge { to: v, weight: w });
        }
    }

    let mut dist = vec![INF; n];
    let mut pq = BinaryHeap::new();

    dist[start] = 0;
    pq.push(State { cost: 0, position: start });

    while let Some(State { cost, position }) = pq.pop() {
        if cost > dist[position] {
            continue;
        }

        for edge in &adj[position] {
            let next = State {
                cost: cost + edge.weight,
                position: edge.to,
            };

            if next.cost < dist[next.position] {
                pq.push(next);
                dist[next.position] = next.cost;
            }
        }
    }

    dist
}
