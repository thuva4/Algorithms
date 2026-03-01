use std::io::{self, Read};

struct DisjointSparseTable {
    table: Vec<Vec<i64>>,
    a: Vec<i64>,
    sz: usize,
    levels: usize,
}

impl DisjointSparseTable {
    fn new(arr: &[i32]) -> Self {
        let n = arr.len();
        let mut sz = 1usize;
        let mut levels = 0usize;
        while sz < n { sz <<= 1; levels += 1; }
        if levels == 0 { levels = 1; }
        let mut a = vec![0i64; sz];
        for i in 0..n { a[i] = arr[i] as i64; }
        let mut table = vec![vec![0i64; sz]; levels];

        for level in 0..levels {
            let block = 1 << (level + 1);
            let half = block >> 1;
            let mut start = 0;
            while start < sz {
                let mid = start + half;
                table[level][mid] = a[mid];
                let end = std::cmp::min(start + block, sz);
                for i in (mid + 1)..end {
                    table[level][i] = table[level][i - 1] + a[i];
                }
                if mid >= 1 && mid - 1 >= start {
                    table[level][mid - 1] = a[mid - 1];
                    if mid >= 2 {
                        for i in (start..=(mid - 2)).rev() {
                            table[level][i] = table[level][i + 1] + a[i];
                        }
                    }
                }
                start += block;
            }
        }
        DisjointSparseTable { table, a, sz, levels }
    }

    fn query(&self, l: usize, r: usize) -> i64 {
        if l == r { return self.a[l]; }
        let level = (31 - ((l ^ r) as u32).leading_zeros()) as usize;
        self.table[level][l] + self.table[level][r]
    }
}

pub fn disjoint_sparse_table(n: usize, array: &Vec<i32>, queries: &Vec<Vec<usize>>) -> Vec<i64> {
    let length = n.min(array.len());
    if length == 0 {
        return Vec::new();
    }
    let mut prefix = vec![0i64; length + 1];
    for index in 0..length {
        prefix[index + 1] = prefix[index] + array[index] as i64;
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
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let n = nums[idx] as usize; idx += 1;
    let arr: Vec<i32> = nums[idx..idx + n].to_vec(); idx += n;
    let dst = DisjointSparseTable::new(&arr);
    let q = nums[idx] as usize; idx += 1;
    let mut results = Vec::new();
    for _ in 0..q {
        let l = nums[idx] as usize; idx += 1;
        let r = nums[idx] as usize; idx += 1;
        results.push(dst.query(l, r).to_string());
    }
    println!("{}", results.join(" "));
}
