use std::io::{self, Read};

fn bitmask_dp(n: usize, cost: &Vec<Vec<i32>>) -> i32 {
    let total = 1usize << n;
    let mut dp = vec![i32::MAX; total];
    dp[0] = 0;

    for mask in 0..total {
        if dp[mask] == i32::MAX { continue; }
        let worker = (mask as u32).count_ones() as usize;
        if worker >= n { continue; }
        for job in 0..n {
            if mask & (1 << job) == 0 {
                let new_mask = mask | (1 << job);
                let val = dp[mask] + cost[worker][job];
                if val < dp[new_mask] {
                    dp[new_mask] = val;
                }
            }
        }
    }

    dp[total - 1]
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();
    let n: usize = iter.next().unwrap().parse().unwrap();
    let mut cost = vec![vec![0i32; n]; n];
    for i in 0..n {
        for j in 0..n {
            cost[i][j] = iter.next().unwrap().parse().unwrap();
        }
    }
    println!("{}", bitmask_dp(n, &cost));
}
