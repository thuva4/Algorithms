use std::io::{self, Read};

struct MergeSortTree { tree: Vec<Vec<i32>>, n: usize }

impl MergeSortTree {
    fn new(arr: &[i32]) -> Self {
        let n = arr.len();
        let mut mst = MergeSortTree { tree: vec![vec![]; 4 * n], n };
        mst.build(arr, 1, 0, n - 1);
        mst
    }

    fn build(&mut self, a: &[i32], nd: usize, s: usize, e: usize) {
        if s == e { self.tree[nd] = vec![a[s]]; return; }
        let m = (s + e) / 2;
        self.build(a, 2*nd, s, m); self.build(a, 2*nd+1, m+1, e);
        let (l, r) = (self.tree[2*nd].clone(), self.tree[2*nd+1].clone());
        let mut merged = Vec::with_capacity(l.len() + r.len());
        let (mut i, mut j) = (0, 0);
        while i < l.len() && j < r.len() {
            if l[i] <= r[j] { merged.push(l[i]); i += 1; }
            else { merged.push(r[j]); j += 1; }
        }
        merged.extend_from_slice(&l[i..]);
        merged.extend_from_slice(&r[j..]);
        self.tree[nd] = merged;
    }

    fn count_leq(&self, l: usize, r: usize, k: i32) -> usize {
        self.query(1, 0, self.n - 1, l, r, k)
    }

    fn query(&self, nd: usize, s: usize, e: usize, l: usize, r: usize, k: i32) -> usize {
        if r < s || e < l { return 0; }
        if l <= s && e <= r {
            return self.tree[nd].partition_point(|&x| x <= k);
        }
        let m = (s + e) / 2;
        self.query(2*nd, s, m, l, r, k) + self.query(2*nd+1, m+1, e, l, r, k)
    }
}

pub fn merge_sort_tree(n: usize, array: &Vec<i32>, queries: &Vec<Vec<i32>>) -> Vec<usize> {
    let length = n.min(array.len());
    if length == 0 {
        return Vec::new();
    }
    let mst = MergeSortTree::new(&array[..length]);
    queries
        .iter()
        .filter(|query| query.len() >= 3)
        .map(|query| mst.count_leq(query[0] as usize, query[1] as usize, query[2]))
        .collect()
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i32> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let n = nums[idx] as usize; idx += 1;
    let arr: Vec<i32> = nums[idx..idx+n].to_vec(); idx += n;
    let mst = MergeSortTree::new(&arr);
    let q = nums[idx] as usize; idx += 1;
    let mut results = Vec::new();
    for _ in 0..q {
        let l = nums[idx] as usize; idx += 1;
        let r = nums[idx] as usize; idx += 1;
        let k = nums[idx]; idx += 1;
        results.push(mst.count_leq(l, r, k).to_string());
    }
    println!("{}", results.join(" "));
}
