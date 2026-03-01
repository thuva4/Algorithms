/// Union-Find (Disjoint Set Union) data structure.
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

    fn union(&mut self, x: usize, y: usize) -> bool {
        let root_x = self.find(x);
        let root_y = self.find(y);

        if root_x == root_y {
            return false;
        }

        if self.rank[root_x] < self.rank[root_y] {
            self.parent[root_x] = root_y;
        } else if self.rank[root_x] > self.rank[root_y] {
            self.parent[root_y] = root_x;
        } else {
            self.parent[root_y] = root_x;
            self.rank[root_x] += 1;
        }
        true
    }
}

/// Kruskal's algorithm to find MST total weight.
fn kruskal_impl(num_vertices: usize, edges: &mut Vec<(usize, usize, i32)>) -> i32 {
    edges.sort_by_key(|e| e.2);

    let mut uf = UnionFind::new(num_vertices);
    let mut total_weight = 0;
    let mut edges_used = 0;

    for &(src, dest, weight) in edges.iter() {
        if edges_used >= num_vertices - 1 {
            break;
        }
        if uf.union(src, dest) {
            total_weight += weight;
            edges_used += 1;
        }
    }

    total_weight
}

pub fn kruskal(num_vertices: usize, edges: &Vec<Vec<i32>>) -> i32 {
    let mut parsed: Vec<(usize, usize, i32)> = edges
        .iter()
        .filter(|edge| edge.len() >= 3)
        .map(|edge| (edge[0] as usize, edge[1] as usize, edge[2]))
        .collect();
    kruskal_impl(num_vertices, &mut parsed)
}

fn main() {
    let mut edges = vec![
        (0, 1, 10),
        (0, 2, 6),
        (0, 3, 5),
        (1, 3, 15),
        (2, 3, 4),
    ];

    let result = kruskal_impl(4, &mut edges);
    println!("MST total weight: {}", result);
}
