pub fn convex_hull_count(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    if n <= 2 { return n as i32; }

    let mut points: Vec<(i32, i32)> = Vec::new();
    let mut idx = 1;
    for _ in 0..n {
        points.push((arr[idx], arr[idx + 1]));
        idx += 2;
    }
    points.sort();

    fn cross(o: (i32, i32), a: (i32, i32), b: (i32, i32)) -> i64 {
        (a.0 as i64 - o.0 as i64) * (b.1 as i64 - o.1 as i64) - (a.1 as i64 - o.1 as i64) * (b.0 as i64 - o.0 as i64)
    }

    let mut hull: Vec<(i32, i32)> = Vec::new();
    for &p in &points {
        while hull.len() >= 2 && cross(hull[hull.len()-2], hull[hull.len()-1], p) <= 0 { hull.pop(); }
        hull.push(p);
    }
    let lower = hull.len() + 1;
    for i in (0..n-1).rev() {
        while hull.len() >= lower && cross(hull[hull.len()-2], hull[hull.len()-1], points[i]) <= 0 { hull.pop(); }
        hull.push(points[i]);
    }
    (hull.len() - 1) as i32
}
