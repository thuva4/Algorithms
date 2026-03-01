use std::collections::{HashMap, HashSet};

/// Topological sort of a directed acyclic graph using DFS.
/// Returns a vector of nodes in topological order.
fn topological_sort(adj_list: &HashMap<i32, Vec<i32>>) -> Vec<i32> {
    let mut visited = HashSet::new();
    let mut stack = Vec::new();

    fn dfs(
        node: i32,
        adj_list: &HashMap<i32, Vec<i32>>,
        visited: &mut HashSet<i32>,
        stack: &mut Vec<i32>,
    ) {
        visited.insert(node);

        if let Some(neighbors) = adj_list.get(&node) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    dfs(neighbor, adj_list, visited, stack);
                }
            }
        }

        stack.push(node);
    }

    let num_nodes = adj_list.len() as i32;
    for i in 0..num_nodes {
        if !visited.contains(&i) {
            dfs(i, adj_list, &mut visited, &mut stack);
        }
    }

    stack.reverse();
    stack
}

fn main() {
    let mut adj_list = HashMap::new();
    adj_list.insert(0, vec![1, 2]);
    adj_list.insert(1, vec![3]);
    adj_list.insert(2, vec![3]);
    adj_list.insert(3, vec![]);

    let result = topological_sort(&adj_list);
    println!("Topological order: {:?}", result);
}
