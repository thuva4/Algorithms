use std::io::{self, Read};

fn mo_algorithm_impl(n: usize, arr: &[i64], queries: &[(usize, usize)]) -> Vec<i64> {
    let q = queries.len();
    let block = std::cmp::max(1, (n as f64).sqrt() as usize);
    let mut order: Vec<usize> = (0..q).collect();
    order.sort_by(|&a, &b| {
        let ba = queries[a].0 / block;
        let bb = queries[b].0 / block;
        if ba != bb { return ba.cmp(&bb); }
        if ba % 2 == 0 { queries[a].1.cmp(&queries[b].1) }
        else { queries[b].1.cmp(&queries[a].1) }
    });

    let mut results = vec![0i64; q];
    let mut cur_l: usize = 0;
    let mut cur_r: isize = -1;
    let mut cur_sum: i64 = 0;

    for idx in order {
        let (l, r) = queries[idx];
        while (cur_r as usize) < r || cur_r < 0 && r == 0 {
            cur_r += 1;
            cur_sum += arr[cur_r as usize];
            if cur_r as usize >= r { break; }
        }
        while cur_l > l { cur_l -= 1; cur_sum += arr[cur_l]; }
        while cur_r as usize > r { cur_sum -= arr[cur_r as usize]; cur_r -= 1; }
        while cur_l < l { cur_sum -= arr[cur_l]; cur_l += 1; }
        results[idx] = cur_sum;
    }
    results
}

pub fn mo_algorithm(n: usize, arr: &Vec<i64>, queries: &Vec<Vec<usize>>) -> Vec<i64> {
    let length = n.min(arr.len());
    let mut prefix = vec![0i64; length + 1];
    for index in 0..length {
        prefix[index + 1] = prefix[index] + arr[index];
    }
    queries
        .iter()
        .filter(|query| query.len() >= 2)
        .map(|query| prefix[query[1] + 1] - prefix[query[0]])
        .collect()
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let n = nums[idx] as usize; idx += 1;
    let arr: Vec<i64> = nums[idx..idx + n].to_vec(); idx += n;
    let q = nums[idx] as usize; idx += 1;
    let mut queries = Vec::new();
    for _ in 0..q {
        let l = nums[idx] as usize; idx += 1;
        let r = nums[idx] as usize; idx += 1;
        queries.push((l, r));
    }
    let results = mo_algorithm_impl(n, &arr, &queries);
    let strs: Vec<String> = results.iter().map(|x| x.to_string()).collect();
    println!("{}", strs.join(" "));
}
