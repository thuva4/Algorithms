use std::io::{self, Read};

struct SqrtDecomp {
    a: Vec<i64>,
    blocks: Vec<i64>,
    block_sz: usize,
}

impl SqrtDecomp {
    fn new(arr: &[i32]) -> Self {
        let n = arr.len();
        let block_sz = std::cmp::max(1, (n as f64).sqrt() as usize);
        let nb = (n + block_sz - 1) / block_sz;
        let a: Vec<i64> = arr.iter().map(|&x| x as i64).collect();
        let mut blocks = vec![0i64; nb];
        for i in 0..n { blocks[i / block_sz] += a[i]; }
        SqrtDecomp { a, blocks, block_sz }
    }

    fn query(&self, l: usize, r: usize) -> i64 {
        let mut result = 0i64;
        let bl = l / self.block_sz;
        let br = r / self.block_sz;
        if bl == br {
            for i in l..=r { result += self.a[i]; }
        } else {
            for i in l..(bl + 1) * self.block_sz { result += self.a[i]; }
            for b in (bl + 1)..br { result += self.blocks[b]; }
            for i in br * self.block_sz..=r { result += self.a[i]; }
        }
        result
    }
}

pub fn sqrt_decomposition(n: usize, array: &Vec<i32>, queries: &Vec<Vec<usize>>) -> Vec<i64> {
    let length = n.min(array.len());
    if length == 0 {
        return Vec::new();
    }
    let sd = SqrtDecomp::new(&array[..length]);
    queries
        .iter()
        .filter(|query| query.len() >= 2)
        .map(|query| sd.query(query[0], query[1]))
        .collect()
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let n = nums[idx] as usize; idx += 1;
    let arr: Vec<i32> = nums[idx..idx + n].to_vec(); idx += n;
    let sd = SqrtDecomp::new(&arr);
    let q = nums[idx] as usize; idx += 1;
    let mut results = Vec::new();
    for _ in 0..q {
        let l = nums[idx] as usize; idx += 1;
        let r = nums[idx] as usize; idx += 1;
        results.push(sd.query(l, r).to_string());
    }
    println!("{}", results.join(" "));
}
