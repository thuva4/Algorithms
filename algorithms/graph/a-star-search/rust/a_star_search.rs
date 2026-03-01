use std::cmp::Ordering;
use std::collections::BinaryHeap;
use std::i32;

#[derive(Copy, Clone, Eq, PartialEq)]
struct Node {
    id: usize,
    f: i32,
    g: i32,
}

impl Ord for Node {
    fn cmp(&self, other: &Self) -> Ordering {
        other.f.cmp(&self.f) // Min-heap
    }
}

impl PartialOrd for Node {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

#[derive(Clone)]
struct Edge {
    to: usize,
    weight: i32,
}

pub fn a_star_search(arr: &[i32]) -> i32 {
    if arr.len() < 2 {
        return -1;
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 3 * m + 2 + n {
        return -1;
    }

    let start = arr[2 + 3 * m] as usize;
    let goal = arr[2 + 3 * m + 1] as usize;

    if start >= n || goal >= n {
        return -1;
    }
    if start == goal {
        return 0;
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

    let h_index = 2 + 3 * m + 2;
    
    let mut open_set = BinaryHeap::new();
    let mut g_score = vec![i32::MAX; n];

    g_score[start] = 0;
    open_set.push(Node {
        id: start,
        f: arr[h_index + start],
        g: 0,
    });

    while let Some(current) = open_set.pop() {
        let u = current.id;

        if u == goal {
            return current.g;
        }

        if current.g > g_score[u] {
            continue;
        }

        for e in &adj[u] {
            let v = e.to;
            let w = e.weight;

            if g_score[u] != i32::MAX && g_score[u] + w < g_score[v] {
                g_score[v] = g_score[u] + w;
                let f = g_score[v] + arr[h_index + v];
                open_set.push(Node {
                    id: v,
                    f,
                    g: g_score[v],
                });
            }
        }
    }

    -1
}
