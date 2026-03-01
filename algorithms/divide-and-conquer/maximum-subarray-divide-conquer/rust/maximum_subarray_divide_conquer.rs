use std::io::{self, Read};

fn helper(arr: &[i64], lo: usize, hi: usize) -> i64 {
    if lo == hi { return arr[lo]; }
    let mid = (lo + hi) / 2;

    let mut left_sum = i64::MIN;
    let mut s: i64 = 0;
    for i in (lo..=mid).rev() { s += arr[i]; left_sum = left_sum.max(s); }
    let mut right_sum = i64::MIN;
    s = 0;
    for i in (mid + 1)..=hi { s += arr[i]; right_sum = right_sum.max(s); }

    let cross = left_sum + right_sum;
    let left_max = helper(arr, lo, mid);
    let right_max = helper(arr, mid + 1, hi);
    cross.max(left_max).max(right_max)
}

fn max_subarray_dc(arr: &[i64]) -> i64 {
    helper(arr, 0, arr.len() - 1)
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = nums[0] as usize;
    let arr: Vec<i64> = nums[1..1 + n].to_vec();
    println!("{}", max_subarray_dc(&arr));
}
