pub fn sumset(set_a: &[i32], set_b: &[i32]) -> Vec<i32> {
    let mut result = Vec::new();
    for &a in set_a {
        for &b in set_b {
            result.push(a + b);
        }
    }
    result.sort();
    result
}
