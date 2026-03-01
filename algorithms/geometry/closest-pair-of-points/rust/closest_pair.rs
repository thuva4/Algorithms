pub fn closest_pair(arr: &[i32]) -> i32 {
    let n = arr.len() / 2;
    let mut points: Vec<(i32, i32)> = (0..n).map(|i| (arr[2 * i], arr[2 * i + 1])).collect();
    points.sort();
    solve(&points, 0, n as i32 - 1)
}

fn dist_sq(a: (i32, i32), b: (i32, i32)) -> i32 {
    (a.0 - b.0) * (a.0 - b.0) + (a.1 - b.1) * (a.1 - b.1)
}

fn solve(pts: &[(i32, i32)], l: i32, r: i32) -> i32 {
    if r - l < 3 {
        let mut mn = i32::MAX;
        for i in l..=r {
            for j in (i + 1)..=r {
                mn = mn.min(dist_sq(pts[i as usize], pts[j as usize]));
            }
        }
        return mn;
    }

    let mid = (l + r) / 2;
    let mid_x = pts[mid as usize].0;

    let dl = solve(pts, l, mid);
    let dr = solve(pts, mid + 1, r);
    let mut d = dl.min(dr);

    let mut strip: Vec<(i32, i32)> = Vec::new();
    for i in l..=r {
        if (pts[i as usize].0 - mid_x) * (pts[i as usize].0 - mid_x) < d {
            strip.push(pts[i as usize]);
        }
    }
    strip.sort_by_key(|p| p.1);

    for i in 0..strip.len() {
        let mut j = i + 1;
        while j < strip.len() && (strip[j].1 - strip[i].1) * (strip[j].1 - strip[i].1) < d {
            d = d.min(dist_sq(strip[i], strip[j]));
            j += 1;
        }
    }

    d
}
