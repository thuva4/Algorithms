pub fn optimal_bst(arr: &[i32]) -> i32 {
    let n = arr[0] as usize;
    let freq: Vec<i32> = arr[1..=n].to_vec();

    let mut cost = vec![vec![0i32; n]; n];
    for i in 0..n {
        cost[i][i] = freq[i];
    }

    for len in 2..=n {
        for i in 0..=(n - len) {
            let j = i + len - 1;
            cost[i][j] = i32::MAX;
            let freq_sum: i32 = freq[i..=j].iter().sum();

            for r in i..=j {
                let left = if r > i { cost[i][r - 1] } else { 0 };
                let right = if r < j { cost[r + 1][j] } else { 0 };
                let c = left + right + freq_sum;
                if c < cost[i][j] {
                    cost[i][j] = c;
                }
            }
        }
    }

    cost[0][n - 1]
}
