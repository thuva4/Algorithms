use std::cmp;

pub fn kadane(arr: &[i32]) -> i32 {
    let mut max_so_far = arr[0];
    let mut max_ending_here = arr[0];

    for &x in &arr[1..] {
        max_ending_here = cmp::max(x, max_ending_here + x);
        max_so_far = cmp::max(max_so_far, max_ending_here);
    }

    max_so_far
}

fn main() {
    let arr = vec![-2, 1, -3, 4, -1, 2, 1, -5, 4];
    println!("{}", kadane(&arr)); // 6
}
