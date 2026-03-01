use std::collections::HashMap;
use std::io::{self, Read};

fn digit_dp(n: i64, target_sum: i32) -> i64 {
    if n <= 0 {
        return 0;
    }

    let s = n.to_string();
    let digits: Vec<i32> = s.chars().map(|c| c as i32 - '0' as i32).collect();
    let num_digits = digits.len();

    let mut memo: HashMap<(usize, i32, bool), i64> = HashMap::new();

    fn solve(
        pos: usize,
        current_sum: i32,
        tight: bool,
        digits: &[i32],
        num_digits: usize,
        target_sum: i32,
        memo: &mut HashMap<(usize, i32, bool), i64>,
    ) -> i64 {
        if current_sum > target_sum {
            return 0;
        }
        if pos == num_digits {
            return if current_sum == target_sum { 1 } else { 0 };
        }

        let key = (pos, current_sum, tight);
        if let Some(&val) = memo.get(&key) {
            return val;
        }

        let limit = if tight { digits[pos] } else { 9 };
        let mut result: i64 = 0;
        for d in 0..=limit {
            result += solve(
                pos + 1,
                current_sum + d,
                tight && d == limit,
                digits,
                num_digits,
                target_sum,
                memo,
            );
        }

        memo.insert(key, result);
        result
    }

    let total = solve(0, 0, true, &digits, num_digits, target_sum, &mut memo);
    if target_sum == 0 { total - 1 } else { total }
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let mut iter = input.split_whitespace();
    let n: i64 = iter.next().unwrap().parse().unwrap();
    let target: i32 = iter.next().unwrap().parse().unwrap();
    println!("{}", digit_dp(n, target));
}
