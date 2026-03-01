fn interval_tree(data: &[i32]) -> i32 {
    let n = data[0] as usize;
    let query = data[2 * n + 1];
    let mut count = 0;
    let mut idx = 1;
    for _ in 0..n {
        let lo = data[idx];
        let hi = data[idx + 1];
        idx += 2;
        if lo <= query && query <= hi {
            count += 1;
        }
    }
    count
}

fn main() {
    println!("{}", interval_tree(&[3, 1, 5, 3, 8, 6, 10, 4]));
    println!("{}", interval_tree(&[2, 1, 3, 5, 7, 10]));
    println!("{}", interval_tree(&[3, 1, 10, 2, 9, 3, 8, 5]));
}
