const INF: i32 = 1000000000;

pub fn bellman_ford(arr: &[i32]) -> Vec<i32> {
    if arr.len() < 2 {
        return Vec::new();
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 3 * m + 1 {
        return Vec::new();
    }

    let start = arr[2 + 3 * m] as usize;

    if start >= n {
        return Vec::new();
    }

    let mut dist = vec![INF; n];
    dist[start] = 0;

    struct Edge {
        u: usize,
        v: usize,
        w: i32,
    }

    let mut edges = Vec::with_capacity(m);
    for i in 0..m {
        edges.push(Edge {
            u: arr[2 + 3 * i] as usize,
            v: arr[2 + 3 * i + 1] as usize,
            w: arr[2 + 3 * i + 2],
        });
    }

    for _ in 0..n - 1 {
        for e in &edges {
            if dist[e.u] != INF && dist[e.u] + e.w < dist[e.v] {
                dist[e.v] = dist[e.u] + e.w;
            }
        }
    }

    for e in &edges {
        if dist[e.u] != INF && dist[e.u] + e.w < dist[e.v] {
            return Vec::new(); // Negative cycle
        }
    }

    dist
}
