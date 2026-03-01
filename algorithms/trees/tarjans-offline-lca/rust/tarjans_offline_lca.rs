use std::collections::VecDeque;

pub fn offline_lca(n: i32, edges: &Vec<Vec<i32>>, queries: &Vec<Vec<i32>>) -> Vec<i32> {
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
        if query.len() < 2 {
            result.push(-1);
            continue;
        }
        let mut u = query[0].max(0) as usize;
        let mut v = query[1].max(0) as usize;
        if u >= node_count || v >= node_count {
            result.push(-1);
            continue;
        }

        while depth[u] > depth[v] {
            u = parent[u];
        }
        while depth[v] > depth[u] {
            v = parent[v];
        }
        while u != v {
            u = parent[u];
            v = parent[v];
        }
        result.push(u as i32);
    }

    result
}
