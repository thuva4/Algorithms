use std::io::{self, Read};

fn knuth_optimization(n: usize, freq: &[i64]) -> i64 {
    if n == 0 { return 0; }
    let mut dp = vec![vec![0i64; n]; n];
    let mut opt = vec![vec![0usize; n]; n];
    let mut prefix = vec![0i64; n + 1];
    for i in 0..n { prefix[i + 1] = prefix[i] + freq[i]; }

    for i in 0..n {
        dp[i][i] = freq[i];
        opt[i][i] = i;
    }

    for len in 2..=n {
        for i in 0..=n - len {
            let j = i + len - 1;
            dp[i][j] = i64::MAX;
            let cost_sum = prefix[j + 1] - prefix[i];
            let lo = opt[i][j - 1];
            let hi = if i + 1 <= j { opt[i + 1][j] } else { j };
            for k in lo..=hi {
                let left = if k > i { dp[i][k - 1] } else { 0 };
                let right = if k < j { dp[k + 1][j] } else { 0 };
                let val = left + right + cost_sum;
                if val < dp[i][j] {
                    dp[i][j] = val;
                    opt[i][j] = k;
                }
            }
        }
    }
    dp[0][n - 1]
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let n = nums[0] as usize;
    let freq: Vec<i64> = nums[1..1 + n].to_vec();
    println!("{}", knuth_optimization(n, &freq));
}
