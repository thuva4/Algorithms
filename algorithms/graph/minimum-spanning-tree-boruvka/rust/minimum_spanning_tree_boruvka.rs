/// Find the minimum spanning tree using Boruvka's algorithm.
///
/// Input format: [n, m, u1, v1, w1, u2, v2, w2, ...]
///
/// # Returns
/// Total weight of the MST
pub fn minimum_spanning_tree_boruvka(arr: &[i32]) -> i32 {
    let mut idx = 0;
    let n = arr[idx] as usize; idx += 1;
    let m = arr[idx] as usize; idx += 1;
    let mut eu = vec![0usize; m];
    let mut ev = vec![0usize; m];
    let mut ew = vec![0i32; m];
    for i in 0..m {
        eu[i] = arr[idx] as usize; idx += 1;
        ev[i] = arr[idx] as usize; idx += 1;
        ew[i] = arr[idx]; idx += 1;
    }

    let mut parent: Vec<usize> = (0..n).collect();
    let mut rank = vec![0usize; n];

    fn find(parent: &mut Vec<usize>, mut x: usize) -> usize {
        while parent[x] != x { parent[x] = parent[parent[x]]; x = parent[x]; }
        x
    }

    fn unite(parent: &mut Vec<usize>, rank: &mut Vec<usize>, x: usize, y: usize) -> bool {
        let mut rx = find(parent, x);
        let mut ry = find(parent, y);
        if rx == ry { return false; }
        if rank[rx] < rank[ry] { std::mem::swap(&mut rx, &mut ry); }
        parent[ry] = rx;
        if rank[rx] == rank[ry] { rank[rx] += 1; }
        true
    }

    let mut total_weight = 0i32;
    let mut num_components = n;

    while num_components > 1 {
        let mut cheapest = vec![-1i32; n];

        for i in 0..m {
            let ru = find(&mut parent, eu[i]);
            let rv = find(&mut parent, ev[i]);
            if ru == rv { continue; }
            if cheapest[ru] == -1 || ew[i] < ew[cheapest[ru] as usize] {
                cheapest[ru] = i as i32;
            }
            if cheapest[rv] == -1 || ew[i] < ew[cheapest[rv] as usize] {
                cheapest[rv] = i as i32;
            }
        }

        for node in 0..n {
            if cheapest[node] != -1 {
                let ci = cheapest[node] as usize;
                if unite(&mut parent, &mut rank, eu[ci], ev[ci]) {
                    total_weight += ew[ci];
                    num_components -= 1;
                }
            }
        }
    }

    total_weight
}

fn main() {
    println!("{}", minimum_spanning_tree_boruvka(&[3, 3, 0, 1, 1, 1, 2, 2, 0, 2, 3]));
    println!("{}", minimum_spanning_tree_boruvka(&[4, 5, 0, 1, 10, 0, 2, 6, 0, 3, 5, 1, 3, 15, 2, 3, 4]));
    println!("{}", minimum_spanning_tree_boruvka(&[2, 1, 0, 1, 7]));
    println!("{}", minimum_spanning_tree_boruvka(&[4, 3, 0, 1, 1, 1, 2, 2, 2, 3, 3]));
}
