use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

/// Prim's algorithm to find MST total weight.
/// Input: number of vertices, weighted adjacency list where each entry is (neighbor, weight).
pub fn prim(num_vertices: usize, adj_list: &HashMap<usize, Vec<Vec<i32>>>) -> i32 {
    let mut in_mst = vec![false; num_vertices];
    let mut key = vec![i32::MAX; num_vertices];
    key[0] = 0;

    // Min-heap: (weight, vertex)
    let mut heap = BinaryHeap::new();
    heap.push(Reverse((0i32, 0usize)));

    let mut total_weight = 0;

    while let Some(Reverse((w, u))) = heap.pop() {
        if in_mst[u] {
            continue;
        }

        in_mst[u] = true;
        total_weight += w;

        if let Some(neighbors) = adj_list.get(&u) {
            for edge in neighbors {
                if edge.len() < 2 {
                    continue;
                }
                let v = edge[0] as usize;
                let weight = edge[1];
                if !in_mst[v] && weight < key[v] {
                    key[v] = weight;
                    heap.push(Reverse((weight, v)));
                }
            }
        }
    }

    total_weight
}

fn main() {
    let mut adj_list = HashMap::new();
    adj_list.insert(0, vec![vec![1, 10], vec![2, 6], vec![3, 5]]);
    adj_list.insert(1, vec![vec![0, 10], vec![3, 15]]);
    adj_list.insert(2, vec![vec![0, 6], vec![3, 4]]);
    adj_list.insert(3, vec![vec![0, 5], vec![1, 15], vec![2, 4]]);

    let result = prim(4, &adj_list);
    println!("MST total weight: {}", result);
}
