use std::cmp;

fn minimax(depth: usize, node_index: usize, is_max: bool, scores: &[i32], h: usize) -> i32 {
    if depth == h {
        return scores[node_index];
    }

    if is_max {
        cmp::max(
            minimax(depth + 1, node_index * 2, false, scores, h),
            minimax(depth + 1, node_index * 2 + 1, false, scores, h),
        )
    } else {
        cmp::min(
            minimax(depth + 1, node_index * 2, true, scores, h),
            minimax(depth + 1, node_index * 2 + 1, true, scores, h),
        )
    }
}

pub fn minimax_solver(tree_values: &[i32], depth: usize, is_maximizing: bool) -> i32 {
    minimax(0, 0, is_maximizing, tree_values, depth)
}

fn main() {
    let scores = [3, 5, 2, 9, 12, 5, 23, 23];
    let h = (scores.len() as f64).log2() as usize;
    let result = minimax(0, 0, true, &scores, h);
    println!("The optimal value is: {}", result);
}
