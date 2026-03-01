use std::collections::HashMap;

/// Bellman-Ford algorithm to find shortest paths from a start node.
/// Returns Ok(distances) or Err("negative_cycle") if a negative cycle exists.
fn bellman_ford(
    num_vertices: usize,
    edges: &[(i32, i32, i64)],
    start_node: usize,
) -> Result<HashMap<usize, f64>, &'static str> {
    let mut dist = vec![f64::INFINITY; num_vertices];
    dist[start_node] = 0.0;

    // Relax all edges V-1 times
    for _ in 0..num_vertices - 1 {
        for &(u, v, w) in edges {
            let u = u as usize;
            let v = v as usize;
            if dist[u] != f64::INFINITY && dist[u] + w as f64 > f64::NEG_INFINITY {
                let new_dist = dist[u] + w as f64;
                if new_dist < dist[v] {
                    dist[v] = new_dist;
                }
            }
        }
    }

    // Check for negative weight cycles
    for &(u, v, w) in edges {
        let u = u as usize;
        let v = v as usize;
        if dist[u] != f64::INFINITY && dist[u] + w as f64 < dist[v] {
            return Err("negative_cycle");
        }
    }

    let mut result = HashMap::new();
    for i in 0..num_vertices {
        result.insert(i, dist[i]);
    }
    Ok(result)
}

fn main() {
    let edges = vec![
        (0, 1, 4),
        (0, 2, 1),
        (2, 1, 2),
        (1, 3, 1),
        (2, 3, 5),
    ];

    match bellman_ford(4, &edges, 0) {
        Ok(distances) => {
            println!("Shortest distances from node 0:");
            let mut keys: Vec<&usize> = distances.keys().collect();
            keys.sort();
            for &node in &keys {
                let d = distances[node];
                if d == f64::INFINITY {
                    println!("  Node {}: Infinity", node);
                } else {
                    println!("  Node {}: {}", node, d as i64);
                }
            }
        }
        Err(msg) => println!("{}", msg),
    }
}
