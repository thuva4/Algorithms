use std::io::{self, Read};

fn bad(l1: (i64, i64), l2: (i64, i64), l3: (i64, i64)) -> bool {
    (l3.1 - l1.1) as f64 * (l1.0 - l2.0) as f64
        <= (l2.1 - l1.1) as f64 * (l1.0 - l3.0) as f64
}

fn convex_hull_trick_impl(lines: &mut Vec<(i64, i64)>, queries: &[i64]) -> Vec<i64> {
    lines.sort_by_key(|l| l.0);
    let mut hull: Vec<(i64, i64)> = Vec::new();
    for &l in lines.iter() {
        while hull.len() >= 2 && bad(hull[hull.len() - 2], hull[hull.len() - 1], l) {
            hull.pop();
        }
        hull.push(l);
    }

    queries
        .iter()
        .map(|&x| {
            let (mut lo, mut hi) = (0usize, hull.len() - 1);
            while lo < hi {
                let mid = (lo + hi) / 2;
                if hull[mid].0 * x + hull[mid].1 <= hull[mid + 1].0 * x + hull[mid + 1].1 {
                    hi = mid;
                } else {
                    lo = mid + 1;
                }
            }
            hull[lo].0 * x + hull[lo].1
        })
        .collect()
}

pub fn convex_hull_trick(n: usize, lines: &Vec<Vec<i64>>, queries: &Vec<i64>) -> Vec<i64> {
    let parsed: Vec<(i64, i64)> = lines
        .iter()
        .take(n)
        .filter(|line| line.len() >= 2)
        .map(|line| (line[0], line[1]))
        .collect();
    if parsed.is_empty() {
        return Vec::new();
    }
    queries
        .iter()
        .map(|&x| parsed.iter().map(|&(m, b)| m * x + b).min().unwrap_or(0))
        .collect()
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let n = nums[idx] as usize; idx += 1;
    let mut lines = Vec::new();
    for _ in 0..n {
        let m = nums[idx]; idx += 1;
        let b = nums[idx]; idx += 1;
        lines.push((m, b));
    }
    let q = nums[idx] as usize; idx += 1;
    let queries: Vec<i64> = nums[idx..idx + q].to_vec();
    let result = convex_hull_trick_impl(&mut lines, &queries);
    let strs: Vec<String> = result.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" "));
}
