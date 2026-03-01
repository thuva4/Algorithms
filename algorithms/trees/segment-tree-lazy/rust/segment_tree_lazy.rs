use std::io::{self, Read};

struct SegTreeLazy {
    tree: Vec<i64>,
    lazy: Vec<i64>,
    n: usize,
}

impl SegTreeLazy {
    fn new(arr: &[i32]) -> Self {
        let n = arr.len();
        let mut st = SegTreeLazy { tree: vec![0; 4 * n], lazy: vec![0; 4 * n], n };
        st.build(arr, 1, 0, n - 1);
        st
    }

    fn build(&mut self, a: &[i32], nd: usize, s: usize, e: usize) {
        if s == e { self.tree[nd] = a[s] as i64; return; }
        let m = (s + e) / 2;
        self.build(a, 2*nd, s, m); self.build(a, 2*nd+1, m+1, e);
        self.tree[nd] = self.tree[2*nd] + self.tree[2*nd+1];
    }

    fn apply_node(&mut self, nd: usize, s: usize, e: usize, v: i64) {
        self.tree[nd] += v * (e as i64 - s as i64 + 1); self.lazy[nd] += v;
    }

    fn push_down(&mut self, nd: usize, s: usize, e: usize) {
        if self.lazy[nd] != 0 {
            let m = (s + e) / 2;
            let v = self.lazy[nd];
            self.apply_node(2*nd, s, m, v);
            self.apply_node(2*nd+1, m+1, e, v);
            self.lazy[nd] = 0;
        }
    }

    fn update(&mut self, l: usize, r: usize, v: i64) {
        let n = self.n - 1;
        self.do_update(1, 0, n, l, r, v);
    }

    fn do_update(&mut self, nd: usize, s: usize, e: usize, l: usize, r: usize, v: i64) {
        if r < s || e < l { return; }
        if l <= s && e <= r { self.apply_node(nd, s, e, v); return; }
        self.push_down(nd, s, e);
        let m = (s + e) / 2;
        self.do_update(2*nd, s, m, l, r, v);
        self.do_update(2*nd+1, m+1, e, l, r, v);
        self.tree[nd] = self.tree[2*nd] + self.tree[2*nd+1];
    }

    fn query(&mut self, l: usize, r: usize) -> i64 {
        let n = self.n - 1;
        self.do_query(1, 0, n, l, r)
    }

    fn do_query(&mut self, nd: usize, s: usize, e: usize, l: usize, r: usize) -> i64 {
        if r < s || e < l { return 0; }
        if l <= s && e <= r { return self.tree[nd]; }
        self.push_down(nd, s, e);
        let m = (s + e) / 2;
        self.do_query(2*nd, s, m, l, r) + self.do_query(2*nd+1, m+1, e, l, r)
    }
}

pub fn segment_tree_lazy(n: usize, array: &Vec<i32>, operations: &Vec<Vec<i64>>) -> Vec<i64> {
    let length = n.min(array.len());
    if length == 0 {
        return Vec::new();
    }

    let mut st = SegTreeLazy::new(&array[..length]);
    let mut results = Vec::new();
    for operation in operations {
        if operation.len() < 4 {
            continue;
        }
        let op_type = operation[0];
        let left = operation[1] as usize;
        let right = operation[2] as usize;
        let value = operation[3];
        if op_type == 1 {
            st.update(left, right, value);
        } else if op_type == 2 {
            results.push(st.query(left, right));
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
    let mut st = SegTreeLazy::new(&arr);
    let q = nums[idx] as usize; idx += 1;
    let mut results = Vec::new();
    for _ in 0..q {
        let t = nums[idx]; idx += 1;
        let l = nums[idx] as usize; idx += 1;
        let r = nums[idx] as usize; idx += 1;
        let v = nums[idx]; idx += 1;
        if t == 1 { st.update(l, r, v); }
        else { results.push(st.query(l, r).to_string()); }
    }
    println!("{}", results.join(" "));
}
