struct UnionFind {
    parent: Vec<usize>,
    rank: Vec<usize>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        UnionFind {
            parent: (0..n).collect(),
            rank: vec![0; n],
        }
    }

    fn find(&mut self, x: usize) -> usize {
        if self.parent[x] != x {
            self.parent[x] = self.find(self.parent[x]);
        }
        self.parent[x]
    }

    fn union(&mut self, x: usize, y: usize) {
        let px = self.find(x);
        let py = self.find(y);
        if px == py {
            return;
        }
        if self.rank[px] < self.rank[py] {
            self.parent[px] = py;
        } else if self.rank[px] > self.rank[py] {
            self.parent[py] = px;
        } else {
            self.parent[py] = px;
            self.rank[px] += 1;
        }
    }

    fn connected(&mut self, x: usize, y: usize) -> bool {
        self.find(x) == self.find(y)
    }
}

pub fn union_find_operations(n: usize, operations: &Vec<Vec<String>>) -> Vec<bool> {
    let mut uf = UnionFind::new(n);
    let mut results = Vec::new();

    for operation in operations {
        if operation.len() < 3 {
            continue;
        }
        let op = operation[0].as_str();
        let a = operation[1].parse::<usize>().unwrap_or(0);
        let b = operation[2].parse::<usize>().unwrap_or(0);
        match op {
            "union" => uf.union(a, b),
            "find" => results.push(uf.connected(a, b)),
            _ => {}
        }
    }

    results
}

fn main() {
    let mut uf = UnionFind::new(5);
    uf.union(0, 1);
    uf.union(1, 2);
    println!("0 and 2 connected: {}", uf.connected(0, 2));
    println!("0 and 3 connected: {}", uf.connected(0, 3));
}
