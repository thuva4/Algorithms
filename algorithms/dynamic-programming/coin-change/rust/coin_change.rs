use std::cmp;

pub fn coin_change(coins: &[i32], amount: usize) -> i32 {
    if amount == 0 {
        return 0;
    }

    let mut dp = vec![i32::MAX; amount + 1];
    dp[0] = 0;

    for i in 1..=amount {
        for &coin in coins {
            let c = coin as usize;
            if c <= i && dp[i - c] != i32::MAX {
                dp[i] = cmp::min(dp[i], dp[i - c] + 1);
            }
        }
    }

    if dp[amount] == i32::MAX { -1 } else { dp[amount] }
}

fn main() {
    let coins = vec![1, 5, 10, 25];
    println!("{}", coin_change(&coins, 30)); // 2
}
