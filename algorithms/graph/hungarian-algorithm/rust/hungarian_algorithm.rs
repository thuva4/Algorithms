/// Hungarian Algorithm - Solve the assignment problem in O(n^3).
///
/// Given an n x n cost matrix, returns (assignment, total_cost) where
/// assignment[i] is the job assigned to worker i.
pub fn hungarian(cost: &Vec<Vec<i32>>) -> (Vec<usize>, i32) {
    let n = cost.len();
    let inf = i32::MAX / 2;

    let mut u = vec![0i32; n + 1];
    let mut v = vec![0i32; n + 1];
    let mut match_job = vec![0usize; n + 1];

    for i in 1..=n {
        match_job[0] = i;
        let mut j0: usize = 0;
        let mut dist = vec![inf; n + 1];
        let mut used = vec![false; n + 1];
        let mut prev_job = vec![0usize; n + 1];

        loop {
            used[j0] = true;
            let w = match_job[j0];
            let mut delta = inf;
            let mut j1: usize = 0;

            for j in 1..=n {
                if !used[j] {
                    let cur = cost[w - 1][j - 1] - u[w as usize] - v[j];
                    if cur < dist[j] {
                        dist[j] = cur;
                        prev_job[j] = j0;
                    }
                    if dist[j] < delta {
                        delta = dist[j];
                        j1 = j;
                    }
                }
            }

            for j in 0..=n {
                if used[j] {
                    u[match_job[j]] += delta;
                    v[j] -= delta;
                } else {
                    dist[j] -= delta;
                }
            }

            j0 = j1;
            if match_job[j0] == 0 {
                break;
            }
        }

        while j0 != 0 {
            match_job[j0] = match_job[prev_job[j0]];
            j0 = prev_job[j0];
        }
    }

    let mut assignment = vec![0usize; n];
    for j in 1..=n {
        assignment[match_job[j] - 1] = j - 1;
    }

    let total_cost: i32 = (0..n).map(|i| cost[i][assignment[i]]).sum();

    (assignment, total_cost)
}

fn main() {
    let cost = vec![
        vec![9, 2, 7],
        vec![6, 4, 3],
        vec![5, 8, 1],
    ];
    let (assignment, total_cost) = hungarian(&cost);
    println!("Assignment: {:?}", assignment);
    println!("Total cost: {}", total_cost);
}
