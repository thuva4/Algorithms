fn range_tree(data: &[i32]) -> i32 {
    let n = data[0] as usize;
    let mut points: Vec<i32> = data[1..1 + n].to_vec();
    points.sort();
    let lo = data[1 + n];
    let hi = data[2 + n];

    let left = points.partition_point(|&x| x < lo);
    let right = points.partition_point(|&x| x <= hi);
    (right - left) as i32
}

fn main() {
    println!("{}", range_tree(&[5, 1, 3, 5, 7, 9, 2, 6]));
    println!("{}", range_tree(&[4, 2, 4, 6, 8, 1, 10]));
    println!("{}", range_tree(&[3, 1, 2, 3, 10, 20]));
}
