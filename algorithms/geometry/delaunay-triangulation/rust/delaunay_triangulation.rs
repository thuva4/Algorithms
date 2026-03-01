pub fn delaunay_triangulation(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    if n < 3 { return 0; }

    let mut points: Vec<(i32, i32)> = (0..n)
        .map(|i| (arr[1 + 2 * i], arr[1 + 2 * i + 1]))
        .collect();
    points.sort();

    fn cross(o: (i32, i32), a: (i32, i32), b: (i32, i32)) -> i64 {
        (a.0 - o.0) as i64 * (b.1 - o.1) as i64 - (a.1 - o.1) as i64 * (b.0 - o.0) as i64
    }

    let mut lower: Vec<(i32, i32)> = Vec::new();
    for &point in &points {
        while lower.len() >= 2 && cross(lower[lower.len() - 2], lower[lower.len() - 1], point) <= 0 {
            lower.pop();
        }
        lower.push(point);
    }

    let mut upper: Vec<(i32, i32)> = Vec::new();
    for &point in points.iter().rev() {
        while upper.len() >= 2 && cross(upper[upper.len() - 2], upper[upper.len() - 1], point) <= 0 {
            upper.pop();
        }
        upper.push(point);
    }

    let hull_count = if n == 1 {
        1
    } else {
        lower.len() + upper.len() - 2
    };

    if hull_count < 2 {
        return 0;
    }

    let triangles = 2 * n as i32 - 2 - hull_count as i32;
    if triangles < 0 {
        0
    } else {
        triangles
    }
}
