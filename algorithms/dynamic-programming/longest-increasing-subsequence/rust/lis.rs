pub fn lis(arr: &[i32]) -> usize {
    let n = arr.len();
    if n == 0 {
        return 0;
    }

    let mut dp = vec![1usize; n];
    let mut max_len = 1;

    for i in 1..n {
        for j in 0..i {
            if arr[j] < arr[i] && dp[j] + 1 > dp[i] {
                dp[i] = dp[j] + 1;
            }
        }
        if dp[i] > max_len {
            max_len = dp[i];
        }
    }

    max_len
}

fn main() {
    let arr = vec![10, 9, 2, 5, 3, 7, 101, 18];
    println!("{}", lis(&arr)); // 4
}
