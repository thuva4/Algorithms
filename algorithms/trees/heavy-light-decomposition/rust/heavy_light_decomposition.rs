use std::collections::VecDeque;

fn path_nodes(
    parent: &[usize],
    depth: &[usize],
    mut u: usize,
    mut v: usize,
) -> Vec<usize> {
    let mut left = Vec::new();
    let mut right = Vec::new();

    while depth[u] > depth[v] {
        left.push(u);
        u = parent[u];
    }
    while depth[v] > depth[u] {
        right.push(v);
        v = parent[v];
    }
    while u != v {
        left.push(u);
        right.push(v);
        u = parent[u];
        v = parent[v];
    }

    left.push(u);
    right.reverse();
    left.extend(right);
    left
}

pub fn hld_path_query(
    n: i32,
    edges: &Vec<Vec<i32>>,
    values: &Vec<i32>,
    queries: &Vec<Vec<String>>,
) -> Vec<i32> {
    let node_count = n.max(0) as usize;
    if node_count == 0 {
        return Vec::new();
    }

    let mut adjacency = vec![Vec::new(); node_count];
    for edge in edges {
        if edge.len() < 2 {
            continue;
        }
        let u = edge[0] as usize;
        let v = edge[1] as usize;
        if u >= node_count || v >= node_count {
            continue;
        }
        adjacency[u].push(v);
        adjacency[v].push(u);
    }

    let mut parent = vec![usize::MAX; node_count];
    let mut depth = vec![0usize; node_count];
    let mut queue = VecDeque::new();
    parent[0] = 0;
    queue.push_back(0usize);

    while let Some(node) = queue.pop_front() {
        for &next in &adjacency[node] {
            if parent[next] == usize::MAX {
                parent[next] = node;
                depth[next] = depth[node] + 1;
                queue.push_back(next);
            }
        }
    }

    let mut result = Vec::new();
    for query in queries {
        if query.len() < 3 {
            result.push(0);
            continue;
        }
        let query_type = query[0].as_str();
        let u = query[1].parse::<usize>().unwrap_or(0);
        let v = query[2].parse::<usize>().unwrap_or(0);
        if u >= node_count || v >= node_count {
            result.push(0);
            continue;
        }

        let nodes = path_nodes(&parent, &depth, u, v);
        let answer = if query_type == "sum" {
            nodes.iter().map(|&node| values.get(node).copied().unwrap_or(0)).sum()
        } else {
            nodes.iter()
                .map(|&node| values.get(node).copied().unwrap_or(i32::MIN))
                .max()
                .unwrap_or(0)
        };
        result.push(answer);
    }

    result
}
