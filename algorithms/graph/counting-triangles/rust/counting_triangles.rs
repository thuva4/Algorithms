pub fn counting_triangles(arr: &[i32]) -> i32 {
    if arr.len() < 2 {
        return 0;
    }
    let n = arr[0] as usize;
    let m = arr[1] as usize;

    if arr.len() < 2 + 2 * m {
        return 0;
    }
    if n < 3 {
        return 0;
    }

    let mut adj = vec![vec![false; n]; n];
    for i in 0..m {
        let u = arr[2 + 2 * i] as usize;
        let v = arr[2 + 2 * i + 1] as usize;
        if u < n && v < n {
            adj[u][v] = true;
            adj[v][u] = true;
        }
    }

    let mut count = 0;
    for i in 0..n {
        for j in i + 1..n {
            if adj[i][j] {
                for k in j + 1..n {
                    if adj[j][k] && adj[k][i] {
                        count += 1;
                    }
                }
            }
        }
    }

    count
}
