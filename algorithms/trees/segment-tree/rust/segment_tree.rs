struct SegmentTree {
    tree: Vec<i64>,
    n: usize,
}

impl SegmentTree {
    fn new(arr: &[i64]) -> Self {
        let n = arr.len();
        let mut st = SegmentTree {
            tree: vec![0; 4 * n],
            n,
        };
        if n > 0 {
            st.build(arr, 0, 0, n - 1);
        }
        st
    }

    fn build(&mut self, arr: &[i64], node: usize, start: usize, end: usize) {
        if start == end {
            self.tree[node] = arr[start];
        } else {
            let mid = (start + end) / 2;
            self.build(arr, 2 * node + 1, start, mid);
            self.build(arr, 2 * node + 2, mid + 1, end);
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2];
        }
    }

    fn update(&mut self, idx: usize, val: i64) {
        self.update_helper(0, 0, self.n - 1, idx, val);
    }

    fn update_helper(&mut self, node: usize, start: usize, end: usize, idx: usize, val: i64) {
        if start == end {
            self.tree[node] = val;
        } else {
            let mid = (start + end) / 2;
            if idx <= mid {
                self.update_helper(2 * node + 1, start, mid, idx, val);
            } else {
                self.update_helper(2 * node + 2, mid + 1, end, idx, val);
            }
            self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2];
        }
    }

    fn query(&self, l: usize, r: usize) -> i64 {
        self.query_helper(0, 0, self.n - 1, l, r)
    }

    fn query_helper(&self, node: usize, start: usize, end: usize, l: usize, r: usize) -> i64 {
        if r < start || end < l {
            return 0;
        }
        if l <= start && end <= r {
            return self.tree[node];
        }
        let mid = (start + end) / 2;
        self.query_helper(2 * node + 1, start, mid, l, r)
            + self.query_helper(2 * node + 2, mid + 1, end, l, r)
    }
}

pub fn segment_tree_operations(array: &Vec<i64>, queries: &Vec<Vec<String>>) -> Vec<i64> {
    if array.is_empty() {
        return Vec::new();
    }

    let mut st = SegmentTree::new(array);
    let mut results = Vec::new();
    for query in queries {
        if query.len() < 3 {
            continue;
        }
        match query[0].as_str() {
            "sum" => {
                let left = query[1].parse::<usize>().unwrap_or(0);
                let right = query[2].parse::<usize>().unwrap_or(0);
                results.push(st.query(left, right));
            }
            "update" => {
                let index = query[1].parse::<usize>().unwrap_or(0);
                let value = query[2].parse::<i64>().unwrap_or(0);
                st.update(index, value);
            }
            _ => {}
        }
    }
    results
}

fn main() {
    let arr = vec![1, 3, 5, 7, 9, 11];
    let mut st = SegmentTree::new(&arr);
    println!("Sum [1, 3]: {}", st.query(1, 3));

    st.update(1, 10);
    println!("After update, sum [1, 3]: {}", st.query(1, 3));
}
