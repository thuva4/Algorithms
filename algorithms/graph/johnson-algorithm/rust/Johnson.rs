use std::collections::HashMap;

/// Johnson's algorithm for all-pairs shortest paths.
fn johnson_impl(num_vertices: usize, edges: &[(i32, i32, i64)]) -> Result<HashMap<usize, HashMap<usize, f64>>, &'static str> {
    // Add virtual node
    let mut all_edges: Vec<(i32, i32, i64)> = edges.to_vec();
    for i in 0..num_vertices {
        all_edges.push((num_vertices as i32, i as i32, 0));
    }

    // Bellman-Ford from virtual node
    let mut h = vec![f64::INFINITY; num_vertices + 1];
    h[num_vertices] = 0.0;

    for _ in 0..num_vertices {
        for &(u, v, w) in &all_edges {
            let u = u as usize;
            let v = v as usize;
            if h[u] != f64::INFINITY && h[u] + w as f64 > f64::NEG_INFINITY {
                let new_dist = h[u] + w as f64;
                if new_dist < h[v] {
                    h[v] = new_dist;
                }
            }
        }
    }

    for &(u, v, w) in &all_edges {
        let u = u as usize;
        let v = v as usize;
        if h[u] != f64::INFINITY && h[u] + (w as f64) < h[v] {
            return Err("negative_cycle");
        }
    }

    // Reweight edges
    let mut adj_list: HashMap<usize, Vec<(usize, i64)>> = HashMap::new();
    for i in 0..num_vertices {
        adj_list.insert(i, Vec::new());
    }
    for &(u, v, w) in edges {
        let u = u as usize;
        let v = v as usize;
        let new_weight = w + h[u] as i64 - h[v] as i64;
        adj_list.entry(u).or_default().push((v, new_weight));
    }

    // Run Dijkstra from each vertex
    let mut result = HashMap::new();
    for u in 0..num_vertices {
        let dist = dijkstra_helper(num_vertices, &adj_list, u);
        let mut distances = HashMap::new();
        for v in 0..num_vertices {
            if dist[v] == f64::INFINITY {
                distances.insert(v, f64::INFINITY);
            } else {
                distances.insert(v, dist[v] - h[u] + h[v]);
            }
        }
        result.insert(u, distances);
    }

    Ok(result)
}

pub fn johnson(num_vertices: usize, edges: &Vec<Vec<i64>>) -> String {
    let parsed: Vec<(i32, i32, i64)> = edges
        .iter()
        .filter(|edge| edge.len() >= 3)
        .map(|edge| (edge[0] as i32, edge[1] as i32, edge[2]))
        .collect();

    match johnson_impl(num_vertices, &parsed) {
        Err(message) => message.to_string(),
        Ok(distances) => {
            let mut rows = Vec::new();
            for source in 0..num_vertices {
                for target in 0..num_vertices {
                    let value = distances
                        .get(&source)
                        .and_then(|row| row.get(&target))
                        .copied()
                        .unwrap_or(f64::INFINITY);
                    if value == f64::INFINITY {
                        rows.push("Infinity".to_string());
                    } else if value == f64::NEG_INFINITY {
                        rows.push("-Infinity".to_string());
                    } else if value.fract() == 0.0 {
                        rows.push((value as i64).to_string());
                    } else {
                        rows.push(value.to_string());
                    }
                }
            }
            rows.join(" ")
        }
    }
}

fn dijkstra_helper(n: usize, adj_list: &HashMap<usize, Vec<(usize, i64)>>, src: usize) -> Vec<f64> {
    let mut dist = vec![f64::INFINITY; n];
    let mut visited = vec![false; n];
    dist[src] = 0.0;

    for _ in 0..n {
        let mut u = None;
        let mut min_dist = f64::INFINITY;
        for i in 0..n {
            if !visited[i] && dist[i] < min_dist {
                min_dist = dist[i];
                u = Some(i);
            }
        }
        let u = match u {
            Some(v) => v,
            None => break,
        };
        visited[u] = true;

        if let Some(neighbors) = adj_list.get(&u) {
            for &(v, w) in neighbors {
                if !visited[v] && dist[u] + w as f64 > f64::NEG_INFINITY {
                    let new_dist = dist[u] + w as f64;
                    if new_dist < dist[v] {
                        dist[v] = new_dist;
                    }
                }
            }
        }
    }
    dist
}

fn main() {
    let edges = vec![(0, 1, 1), (1, 2, 2), (2, 3, 3), (0, 3, 10)];

    match johnson_impl(4, &edges) {
        Ok(result) => {
            println!("All-pairs shortest distances:");
            for u in 0..4 {
                println!("From {}: {:?}", u, result[&u]);
            }
        }
        Err(msg) => println!("{}", msg),
    }
}
