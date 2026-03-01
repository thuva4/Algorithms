const INF: i32 = 1000000000;

pub fn all_pairs_shortest_path(arr: &[i32]) -> i32 {
    if arr.len() < 2 {
        return -1;
    }

    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 3 * m {
        return -1;
    }
    if n == 0 {
        return -1;
    }
    if n == 1 {
        return 0;
    }

    let mut dist = vec![vec![INF; n]; n];
    for i in 0..n {
        dist[i][i] = 0;
    }

    for i in 0..m {
        let u = arr[2 + 3 * i] as usize;
        let v = arr[2 + 3 * i + 1] as usize;
        let w = arr[2 + 3 * i + 2];

        if u < n && v < n {
            if w < dist[u][v] {
                dist[u][v] = w;
            }
        }
    }

    for k in 0..n {
        for i in 0..n {
            for j in 0..n {
                if dist[i][k] != INF && dist[k][j] != INF {
                    if dist[i][k] + dist[k][j] < dist[i][j] {
                        dist[i][j] = dist[i][k] + dist[k][j];
                    }
                }
            }
        }
    }

    if dist[0][n - 1] == INF {
        -1
    } else {
        dist[0][n - 1]
    }
}
