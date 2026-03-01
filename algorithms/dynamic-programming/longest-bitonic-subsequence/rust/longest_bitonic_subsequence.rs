use std::cmp;

pub fn longest_bitonic_subsequence(arr: &[i32]) -> usize {
    let n = arr.len();
    if n == 0 {
        return 0;
    }

    let mut lis = vec![1usize; n];
    let mut lds = vec![1usize; n];

    for i in 1..n {
        for j in 0..i {
            if arr[j] < arr[i] && lis[j] + 1 > lis[i] {
                lis[i] = lis[j] + 1;
            }
        }
    }

    for i in (0..n - 1).rev() {
        for j in (i + 1..n).rev() {
            if arr[j] < arr[i] && lds[j] + 1 > lds[i] {
                lds[i] = lds[j] + 1;
            }
        }
    }

    let mut result = 0;
    for i in 0..n {
        result = cmp::max(result, lis[i] + lds[i] - 1);
    }

    result
}

fn main() {
    let arr = vec![1, 3, 4, 2, 6, 1];
    println!("{}", longest_bitonic_subsequence(&arr)); // 5
}
