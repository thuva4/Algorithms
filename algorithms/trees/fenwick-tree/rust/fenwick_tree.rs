struct FenwickTree {
    tree: Vec<i64>,
    n: usize,
}

impl FenwickTree {
    fn new(arr: &[i64]) -> Self {
        let n = arr.len();
        let mut ft = FenwickTree {
            tree: vec![0; n + 1],
            n,
        };
        for (i, &v) in arr.iter().enumerate() {
            ft.update(i, v);
        }
        ft
    }

    fn update(&mut self, idx: usize, delta: i64) {
        let mut i = idx + 1;
        while i <= self.n {
            self.tree[i] += delta;
            i += i & i.wrapping_neg();
        }
    }

    fn query(&self, idx: usize) -> i64 {
        let mut sum = 0;
        let mut i = idx + 1;
        while i > 0 {
            sum += self.tree[i];
            i -= i & i.wrapping_neg();
        }
        sum
    }
}

pub fn fenwick_tree_operations(array: &Vec<i64>, queries: &Vec<Vec<String>>) -> Vec<i64> {
    let mut ft = FenwickTree::new(array);
    let mut current = array.clone();
    let mut results = Vec::new();

    for query in queries {
        if query.len() < 2 {
            continue;
        }
        match query[0].as_str() {
            "sum" => {
                let index = query[1].parse::<usize>().unwrap_or(0);
                results.push(ft.query(index));
            }
            "update" => {
                if query.len() >= 3 {
                    let index = query[1].parse::<usize>().unwrap_or(0);
                    let value = query[2].parse::<i64>().unwrap_or(0);
                    let previous = current.get(index).copied().unwrap_or(0);
                    let delta = value - previous;
                    if let Some(slot) = current.get_mut(index) {
                        *slot = value;
                    }
                    ft.update(index, delta);
                }
            }
            _ => {}
        }
    }

    results
}

fn main() {
    let arr = vec![1, 2, 3, 4, 5];
    let mut ft = FenwickTree::new(&arr);
    println!("Sum of first 4 elements: {}", ft.query(3));

    ft.update(2, 5);
    println!("After update, sum of first 4 elements: {}", ft.query(3));
}
