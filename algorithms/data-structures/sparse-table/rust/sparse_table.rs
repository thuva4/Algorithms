use std::io::{self, Read};

struct SparseTable {
    table: Vec<Vec<i32>>,
    lg: Vec<usize>,
}

impl SparseTable {
    fn new(arr: &[i32]) -> Self {
        let n = arr.len();
        let mut k = 1;
        while (1 << k) <= n { k += 1; }
        let mut table = vec![vec![0i32; n]; k];
        let mut lg = vec![0usize; n + 1];
        for i in 2..=n { lg[i] = lg[i / 2] + 1; }

        for i in 0..n { table[0][i] = arr[i]; }
        for j in 1..k {
            for i in 0..=(n - (1 << j)) {
                table[j][i] = table[j-1][i].min(table[j-1][i + (1 << (j-1))]);
            }
        }
        SparseTable { table, lg }
    }

    fn query(&self, l: usize, r: usize) -> i32 {
        let k = self.lg[r - l + 1];
        self.table[k][l].min(self.table[k][r - (1 << k) + 1])
    }
}

pub fn sparse_table(n: usize, array: &Vec<i32>, queries: &Vec<Vec<usize>>) -> Vec<i32> {
    let length = n.min(array.len());
    if length == 0 {
        return Vec::new();
    }
    let st = SparseTable::new(&array[..length]);
    queries
        .iter()
        .filter(|query| query.len() >= 2)
        .map(|query| st.query(query[0], query[1]))
        .collect()
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let n = nums[idx] as usize; idx += 1;
    let arr: Vec<i32> = nums[idx..idx+n].to_vec(); idx += n;
    let st = SparseTable::new(&arr);
    let q = nums[idx] as usize; idx += 1;
    let mut results = Vec::new();
    for _ in 0..q {
        let l = nums[idx] as usize; idx += 1;
        let r = nums[idx] as usize; idx += 1;
        results.push(st.query(l, r).to_string());
    }
    println!("{}", results.join(" "));
}
