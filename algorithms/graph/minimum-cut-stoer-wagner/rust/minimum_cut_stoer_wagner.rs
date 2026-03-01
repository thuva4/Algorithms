pub fn minimum_cut_stoer_wagner(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let m = arr[1] as usize;
    let mut w = vec![vec![0i32; n]; n];
    let mut idx = 2;
    for _ in 0..m {
        let u = arr[idx] as usize;
        let v = arr[idx + 1] as usize;
        let c = arr[idx + 2];
        w[u][v] += c;
        w[v][u] += c;
        idx += 3;
    }

    let mut merged = vec![false; n];
    let mut best = i32::MAX;

    for phase in 0..n - 1 {
        let mut key = vec![0i32; n];
        let mut in_a = vec![false; n];
        let mut prev: i32 = -1;
        let mut last: i32 = -1;

        for _ in 0..n - phase {
            let mut sel: i32 = -1;
            for v in 0..n {
                if !merged[v] && !in_a[v] {
                    if sel == -1 || key[v] > key[sel as usize] {
                        sel = v as i32;
                    }
                }
            }
            let s = sel as usize;
            in_a[s] = true;
            prev = last;
            last = sel;
            for v in 0..n {
                if !merged[v] && !in_a[v] {
                    key[v] += w[s][v];
                }
            }
        }

        let l = last as usize;
        if key[l] < best {
            best = key[l];
        }

        let p = prev as usize;
        for v in 0..n {
            w[p][v] += w[l][v];
            w[v][p] += w[v][l];
        }
        merged[l] = true;
    }

    best
}
