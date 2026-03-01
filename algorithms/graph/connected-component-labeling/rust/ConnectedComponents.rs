use std::collections::{HashMap, HashSet};

/// Find all connected components in an undirected graph using DFS.
fn connected_components(adj_list: &HashMap<i32, Vec<i32>>) -> Vec<Vec<i32>> {
    let mut visited = HashSet::new();
    let mut components = Vec::new();

    fn dfs(
        adj_list: &HashMap<i32, Vec<i32>>,
        node: i32,
        visited: &mut HashSet<i32>,
        component: &mut Vec<i32>,
    ) {
        visited.insert(node);
        component.push(node);
        if let Some(neighbors) = adj_list.get(&node) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    dfs(adj_list, neighbor, visited, component);
                }
            }
        }
    }

    let num_nodes = adj_list.len() as i32;
    for i in 0..num_nodes {
        if !visited.contains(&i) {
            let mut component = Vec::new();
            dfs(adj_list, i, &mut visited, &mut component);
            components.push(component);
        }
    }

    components
}

fn main() {
    let mut adj_list = HashMap::new();
    adj_list.insert(0, vec![1]);
    adj_list.insert(1, vec![0]);
    adj_list.insert(2, vec![3]);
    adj_list.insert(3, vec![2]);

    let components = connected_components(&adj_list);
    println!("Connected components: {:?}", components);
}
