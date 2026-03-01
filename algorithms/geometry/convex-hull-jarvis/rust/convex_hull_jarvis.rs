pub fn convex_hull_jarvis(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    if n < 2 { return n as i32; }

    let px: Vec<i32> = (0..n).map(|i| arr[1 + 2 * i]).collect();
    let py: Vec<i32> = (0..n).map(|i| arr[1 + 2 * i + 1]).collect();

    let cross = |o: usize, a: usize, b: usize| -> i32 {
        (px[a] - px[o]) * (py[b] - py[o]) - (py[a] - py[o]) * (px[b] - px[o])
    };

    let dist_sq = |a: usize, b: usize| -> i32 {
        (px[a] - px[b]) * (px[a] - px[b]) + (py[a] - py[b]) * (py[a] - py[b])
    };

    let mut start = 0;
    for i in 1..n {
        if px[i] < px[start] || (px[i] == px[start] && py[i] < py[start]) {
            start = i;
        }
    }

    let mut hull_count = 0;
    let mut current = start;
    loop {
        hull_count += 1;
        let mut candidate = 0;
        for i in 1..n {
            if i == current { continue; }
            if candidate == current { candidate = i; continue; }
            let c = cross(current, candidate, i);
            if c < 0 {
                candidate = i;
            } else if c == 0 && dist_sq(current, i) > dist_sq(current, candidate) {
                candidate = i;
            }
        }
        current = candidate;
        if current == start { break; }
    }

    hull_count
}
