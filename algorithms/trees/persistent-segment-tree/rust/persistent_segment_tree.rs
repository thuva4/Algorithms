use std::io::{self, Read};

struct PersistentST {
    val: Vec<i64>,
    left: Vec<usize>,
    right: Vec<usize>,
}

impl PersistentST {
    fn new() -> Self {
        PersistentST { val: Vec::new(), left: Vec::new(), right: Vec::new() }
    }

    fn new_node(&mut self, v: i64, l: usize, r: usize) -> usize {
        let id = self.val.len();
        self.val.push(v); self.left.push(l); self.right.push(r);
        id
    }

    fn build(&mut self, a: &[i32], s: usize, e: usize) -> usize {
        if s == e { return self.new_node(a[s] as i64, 0, 0); }
        let m = (s + e) / 2;
        let l = self.build(a, s, m);
        let r = self.build(a, m + 1, e);
        let v = self.val[l] + self.val[r];
        self.new_node(v, l, r)
    }

    fn update(&mut self, nd: usize, s: usize, e: usize, idx: usize, v: i32) -> usize {
        if s == e { return self.new_node(v as i64, 0, 0); }
        let m = (s + e) / 2;
        if idx <= m {
            let nl = self.update(self.left[nd], s, m, idx, v);
            let rv = self.val[nl] + self.val[self.right[nd]];
            self.new_node(rv, nl, self.right[nd])
        } else {
            let nr = self.update(self.right[nd], m + 1, e, idx, v);
            let rv = self.val[self.left[nd]] + self.val[nr];
            self.new_node(rv, self.left[nd], nr)
        }
    }

    fn query(&self, nd: usize, s: usize, e: usize, l: usize, r: usize) -> i64 {
        if r < s || e < l { return 0; }
        if l <= s && e <= r { return self.val[nd]; }
        let m = (s + e) / 2;
        self.query(self.left[nd], s, m, l, r) + self.query(self.right[nd], m + 1, e, l, r)
    }
}

pub fn persistent_segment_tree(n: usize, array: &Vec<i32>, operations: &Vec<Vec<i64>>) -> Vec<i64> {
    if n == 0 {
        return Vec::new();
    }

    let mut pst = PersistentST::new();
    let root0 = pst.build(&array[..n.min(array.len())], 0, n - 1);
    let mut roots = vec![root0];
    let mut results = Vec::new();

    for operation in operations {
        if operation.len() < 4 {
            continue;
        }
        let op_type = operation[0];
        let a1 = operation[1] as usize;
        let b1 = operation[2] as usize;
        let c1 = operation[3] as i32;
        if op_type == 1 {
            let next_root = pst.update(roots[a1], 0, n - 1, b1, c1);
            roots.push(next_root);
        } else if op_type == 2 {
            results.push(pst.query(roots[a1], 0, n - 1, b1, c1 as usize));
        }
    }

    results
}

fn main() {
    let mut input = String::new();
    io::stdin().read_to_string(&mut input).unwrap();
    let nums: Vec<i64> = input.split_whitespace().map(|x| x.parse().unwrap()).collect();
    let mut idx = 0;
    let n = nums[idx] as usize; idx += 1;
    let arr: Vec<i32> = nums[idx..idx+n].iter().map(|&x| x as i32).collect(); idx += n;
    let mut pst = PersistentST::new();
    let root0 = pst.build(&arr, 0, n - 1);
    let mut roots = vec![root0];
    let q = nums[idx] as usize; idx += 1;
    let mut results = Vec::new();
    for _ in 0..q {
        let t = nums[idx]; idx += 1;
        let a1 = nums[idx] as usize; idx += 1;
        let b1 = nums[idx] as usize; idx += 1;
        let c1 = nums[idx] as i32; idx += 1;
        if t == 1 {
            let nr = pst.update(roots[a1], 0, n - 1, b1, c1);
            roots.push(nr);
        } else {
            results.push(pst.query(roots[a1], 0, n - 1, b1, c1 as usize).to_string());
        }
    }
    println!("{}", results.join(" "));
}
