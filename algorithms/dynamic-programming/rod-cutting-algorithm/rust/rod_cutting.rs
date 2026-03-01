use std::cmp;

pub fn rod_cut(prices: &[i32], n: usize) -> i32 {
    let mut dp = vec![0i32; n + 1];

    for i in 1..=n {
        for j in 0..i {
            dp[i] = cmp::max(dp[i], prices[j] + dp[i - j - 1]);
        }
    }

    dp[n]
}

fn main() {
    let prices = vec![1, 5, 8, 9, 10, 17, 17, 20];
    println!("{}", rod_cut(&prices, 8)); // 22
}
