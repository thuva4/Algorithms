use std::cmp;

pub fn knapsack(weights: &[usize], values: &[i32], capacity: usize) -> i32 {
    let n = weights.len();
    let mut dp = vec![vec![0i32; capacity + 1]; n + 1];

    for i in 1..=n {
        for w in 0..=capacity {
            if weights[i - 1] > w {
                dp[i][w] = dp[i - 1][w];
            } else {
                dp[i][w] = cmp::max(dp[i - 1][w], dp[i - 1][w - weights[i - 1]] + values[i - 1]);
            }
        }
    }

    dp[n][capacity]
}

fn main() {
    let weights = vec![1, 3, 4, 5];
    let values = vec![1, 4, 5, 7];
    let capacity = 7;
    println!("{}", knapsack(&weights, &values, capacity)); // 9
}
