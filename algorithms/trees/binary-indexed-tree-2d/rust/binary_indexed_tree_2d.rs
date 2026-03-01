use std::io::{self, Read};

struct BIT2D { tree: Vec<Vec<i64>>, rows: usize, cols: usize }

impl BIT2D {
    fn new(rows: usize, cols: usize) -> Self {
        BIT2D { tree: vec![vec![0; cols + 1]; rows + 1], rows, cols }
    }

    fn update(&mut self, r: usize, c: usize, val: i64) {
        let mut i = r + 1;
        while i <= self.rows {
            let mut j = c + 1;
            while j <= self.cols { self.tree[i][j] += val; j += j & j.wrapping_neg(); }
            i += i & i.wrapping_neg();
        }
    }

    fn query(&self, r: usize, c: usize) -> i64 {
        let mut s = 0i64;
        let mut i = r + 1;
        while i > 0 {
            let mut j = c + 1;
            while j > 0 { s += self.tree[i][j]; j -= j & j.wrapping_neg(); }
            i -= i & i.wrapping_neg();
        }
        s
    }
}

pub fn binary_indexed_tree_2d(
    rows: usize,
    cols: usize,
    matrix: &Vec<Vec<i64>>,
    operations: &Vec<Vec<i64>>,
) -> Vec<i64> {
    let mut bit = BIT2D::new(rows, cols);
    for r in 0..rows {
        for c in 0..cols {
            let value = matrix.get(r).and_then(|row| row.get(c)).copied().unwrap_or(0);
            if value != 0 {
                bit.update(r, c, value);
            }
        }
    }

    let mut results = Vec::new();
    for operation in operations {
        if operation.len() < 4 {
            continue;
        }
        let op_type = operation[0];
        let r = operation[1] as usize;
        let c = operation[2] as usize;
        let value = operation[3];
        if op_type == 1 {
            bit.update(r, c, value);
        } else if op_type == 2 {
            results.push(bit.query(r, c));
        }
    }
    results
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let rows = nums[idx] as usize; idx += 1;
    let cols = nums[idx] as usize; idx += 1;
    let mut bit = BIT2D::new(rows, cols);
    for r in 0..rows {
        for c in 0..cols {
            let v = nums[idx]; idx += 1;
            if v != 0 { bit.update(r, c, v); }
        }
    }
    let q = nums[idx] as usize; idx += 1;
    let mut results = Vec::new();
    for _ in 0..q {
        let t = nums[idx]; idx += 1;
        let r = nums[idx] as usize; idx += 1;
        let c = nums[idx] as usize; idx += 1;
        let v = nums[idx]; idx += 1;
        if t == 1 { bit.update(r, c, v); }
        else { results.push(bit.query(r, c).to_string()); }
    }
    println!("{}", results.join(" "));
}
