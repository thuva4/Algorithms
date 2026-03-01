use std::collections::{HashMap, HashSet};

/// Longest path in a DAG using topological sort.
fn longest_path_impl(adj_list: &HashMap<i32, Vec<(i32, i32)>>, start_node: i32) -> HashMap<i32, f64> {
    let num_nodes = adj_list.len() as i32;
    let mut visited = HashSet::new();
    let mut topo_order = Vec::new();

    fn dfs(
        adj_list: &HashMap<i32, Vec<(i32, i32)>>,
        node: i32,
        visited: &mut HashSet<i32>,
        topo_order: &mut Vec<i32>,
    ) {
        visited.insert(node);
        if let Some(neighbors) = adj_list.get(&node) {
            for &(v, _) in neighbors {
                if !visited.contains(&v) {
                    dfs(adj_list, v, visited, topo_order);
                }
            }
        }
        topo_order.push(node);
    }

    for i in 0..num_nodes {
        if !visited.contains(&i) {
            dfs(adj_list, i, &mut visited, &mut topo_order);
        }
    }

    let mut dist = vec![f64::NEG_INFINITY; num_nodes as usize];
    dist[start_node as usize] = 0.0;

    for i in (0..topo_order.len()).rev() {
        let u = topo_order[i];
        let ui = u as usize;
        if dist[ui] != f64::NEG_INFINITY {
            if let Some(neighbors) = adj_list.get(&u) {
                for &(v, w) in neighbors {
                    let vi = v as usize;
                    if dist[ui] + w as f64 > dist[vi] {
                        dist[vi] = dist[ui] + w as f64;
                    }
                }
            }
        }
    }

    let mut result = HashMap::new();
    for i in 0..num_nodes {
        result.insert(i, dist[i as usize]);
    }
    result
}

pub fn longest_path(adj_list: &HashMap<i32, Vec<Vec<i32>>>, start_node: i32) -> Vec<f64> {
    let mut converted = HashMap::new();
    for (node, neighbors) in adj_list {
        let mapped = neighbors
            .iter()
            .filter(|pair| pair.len() >= 2)
            .map(|pair| (pair[0], pair[1]))
            .collect();
        converted.insert(*node, mapped);
    }
    let result = longest_path_impl(&converted, start_node);
    let mut ordered = Vec::new();
    let mut keys: Vec<i32> = converted.keys().copied().collect();
    keys.sort();
    for key in keys {
        ordered.push(*result.get(&key).unwrap_or(&f64::NEG_INFINITY));
    }
    ordered
}

fn main() {
    let mut adj_list = HashMap::new();
    adj_list.insert(0, vec![(1, 3), (2, 6)]);
    adj_list.insert(1, vec![(3, 4), (2, 4)]);
    adj_list.insert(2, vec![(3, 2)]);
    adj_list.insert(3, vec![]);

    let result = longest_path_impl(&adj_list, 0);
    println!("Longest distances: {:?}", result);
}
