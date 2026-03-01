use std::collections::HashSet;

pub fn voronoi_diagram(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    if n < 3 { return 0; }

    let px: Vec<f64> = (0..n).map(|i| arr[1 + 2 * i] as f64).collect();
    let py: Vec<f64> = (0..n).map(|i| arr[1 + 2 * i + 1] as f64).collect();

    let eps = 1e-9;
    let mut vertices: HashSet<(i64, i64)> = HashSet::new();

    for i in 0..n {
        for j in (i + 1)..n {
            for k in (j + 1)..n {
                let (ax, ay) = (px[i], py[i]);
                let (bx, by) = (px[j], py[j]);
                let (cx, cy) = (px[k], py[k]);

                let d = 2.0 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
                if d.abs() < eps { continue; }

                let ux = ((ax*ax + ay*ay) * (by - cy) +
                          (bx*bx + by*by) * (cy - ay) +
                          (cx*cx + cy*cy) * (ay - by)) / d;
                let uy = ((ax*ax + ay*ay) * (cx - bx) +
                          (bx*bx + by*by) * (ax - cx) +
                          (cx*cx + cy*cy) * (bx - ax)) / d;

                let r_sq = (ux - ax) * (ux - ax) + (uy - ay) * (uy - ay);

                let mut valid = true;
                for m in 0..n {
                    if m == i || m == j || m == k { continue; }
                    let dist_sq = (ux - px[m]) * (ux - px[m]) + (uy - py[m]) * (uy - py[m]);
                    if dist_sq < r_sq - eps {
                        valid = false;
                        break;
                    }
                }

                if valid {
                    let rx = (ux * 1000000.0).round() as i64;
                    let ry = (uy * 1000000.0).round() as i64;
                    vertices.insert((rx, ry));
                }
            }
        }
    }

    vertices.len() as i32
}
