use std::collections::{HashMap, HashSet};

/// Kosaraju's algorithm to find strongly connected components.
fn find_sccs(adj_list: &HashMap<i32, Vec<i32>>) -> Vec<Vec<i32>> {
    let num_nodes = adj_list.len() as i32;
    let mut visited = HashSet::new();
    let mut finish_order = Vec::new();

    // First DFS pass
    fn dfs1(
        node: i32,
        adj_list: &HashMap<i32, Vec<i32>>,
        visited: &mut HashSet<i32>,
        finish_order: &mut Vec<i32>,
    ) {
        visited.insert(node);
        if let Some(neighbors) = adj_list.get(&node) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    dfs1(neighbor, adj_list, visited, finish_order);
                }
            }
        }
        finish_order.push(node);
    }

    for i in 0..num_nodes {
        if !visited.contains(&i) {
            dfs1(i, adj_list, &mut visited, &mut finish_order);
        }
    }

    // Build reverse graph
    let mut rev_adj: HashMap<i32, Vec<i32>> = HashMap::new();
    for &node in adj_list.keys() {
        rev_adj.entry(node).or_insert_with(Vec::new);
    }
    for (&node, neighbors) in adj_list {
        for &neighbor in neighbors {
            rev_adj.entry(neighbor).or_insert_with(Vec::new).push(node);
        }
    }

    // Second DFS pass on reversed graph
    visited.clear();
    let mut components = Vec::new();

    fn dfs2(
        node: i32,
        rev_adj: &HashMap<i32, Vec<i32>>,
        visited: &mut HashSet<i32>,
        component: &mut Vec<i32>,
    ) {
        visited.insert(node);
        component.push(node);
        if let Some(neighbors) = rev_adj.get(&node) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    dfs2(neighbor, rev_adj, visited, component);
                }
            }
        }
    }

    for &node in finish_order.iter().rev() {
        if !visited.contains(&node) {
            let mut component = Vec::new();
            dfs2(node, &rev_adj, &mut visited, &mut component);
            components.push(component);
        }
    }

    components
}

fn main() {
    let mut adj_list = HashMap::new();
    adj_list.insert(0, vec![1]);
    adj_list.insert(1, vec![2]);
    adj_list.insert(2, vec![0, 3]);
    adj_list.insert(3, vec![4]);
    adj_list.insert(4, vec![3]);

    let components = find_sccs(&adj_list);
    println!("SCCs: {:?}", components);
}
