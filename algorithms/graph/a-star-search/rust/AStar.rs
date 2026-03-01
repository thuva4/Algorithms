use std::collections::{BinaryHeap, HashMap, HashSet};
use std::cmp::Ordering;

#[derive(PartialEq)]
struct State {
    cost: f64,
    node: i32,
}

impl Eq for State {}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        other.cost.partial_cmp(&self.cost) // Min-heap
    }
}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        self.partial_cmp(other).unwrap_or(Ordering::Equal)
    }
}

/// A* search algorithm to find shortest path from start to goal.
/// Returns (path, cost).
fn a_star(
    adj_list: &HashMap<i32, Vec<(i32, i32)>>,
    start: i32,
    goal: i32,
    heuristic: &HashMap<i32, i32>,
) -> (Vec<i32>, f64) {
    if start == goal {
        return (vec![start], 0.0);
    }

    let mut g_score: HashMap<i32, f64> = HashMap::new();
    let mut came_from: HashMap<i32, i32> = HashMap::new();
    let mut closed_set = HashSet::new();

    for &node in adj_list.keys() {
        g_score.insert(node, f64::INFINITY);
    }
    g_score.insert(start, 0.0);

    let mut heap = BinaryHeap::new();
    heap.push(State {
        cost: *heuristic.get(&start).unwrap_or(&0) as f64,
        node: start,
    });

    while let Some(State { node: current, .. }) = heap.pop() {
        if current == goal {
            let mut path = Vec::new();
            let mut node = goal;
            loop {
                path.push(node);
                match came_from.get(&node) {
                    Some(&prev) => node = prev,
                    None => break,
                }
            }
            path.reverse();
            return (path, g_score[&goal]);
        }

        if closed_set.contains(&current) {
            continue;
        }
        closed_set.insert(current);

        if let Some(neighbors) = adj_list.get(&current) {
            for &(neighbor, weight) in neighbors {
                if closed_set.contains(&neighbor) {
                    continue;
                }

                let tentative_g = g_score[&current] + weight as f64;
                if tentative_g < *g_score.get(&neighbor).unwrap_or(&f64::INFINITY) {
                    came_from.insert(neighbor, current);
                    g_score.insert(neighbor, tentative_g);
                    let f_score = tentative_g + *heuristic.get(&neighbor).unwrap_or(&0) as f64;
                    heap.push(State {
                        cost: f_score,
                        node: neighbor,
                    });
                }
            }
        }
    }

    (vec![], f64::INFINITY)
}

fn main() {
    let mut adj_list = HashMap::new();
    adj_list.insert(0, vec![(1, 1), (2, 4)]);
    adj_list.insert(1, vec![(2, 2), (3, 6)]);
    adj_list.insert(2, vec![(3, 3)]);
    adj_list.insert(3, vec![]);

    let mut heuristic = HashMap::new();
    heuristic.insert(0, 5);
    heuristic.insert(1, 4);
    heuristic.insert(2, 2);
    heuristic.insert(3, 0);

    let (path, cost) = a_star(&adj_list, 0, 3, &heuristic);
    println!("Path: {:?}, Cost: {}", path, cost);
}
