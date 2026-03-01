use std::cmp;

fn minimax_ab(depth: usize, node_index: usize, is_max: bool, scores: &[i32], h: usize, mut alpha: i32, mut beta: i32) -> i32 {
    if depth == h {
        return scores[node_index];
    }

    if is_max {
        let mut best_val = i32::MIN;
        for &child_index in &[node_index * 2, node_index * 2 + 1] {
            let child_value = minimax_ab(depth + 1, child_index, false, scores, h, alpha, beta);
            best_val = cmp::max(best_val, child_value);
            alpha = cmp::max(alpha, best_val);
            if beta <= alpha {
                break;
            }
        }
        best_val
    } else {
        let mut best_val = i32::MAX;
        for &child_index in &[node_index * 2, node_index * 2 + 1] {
            let child_value = minimax_ab(depth + 1, child_index, true, scores, h, alpha, beta);
            best_val = cmp::min(best_val, child_value);
            beta = cmp::min(beta, best_val);
            if beta <= alpha {
                break;
            }
        }
        best_val
    }
}

pub fn minimax_ab_solver(tree_values: &[i32], depth: usize, is_maximizing: bool) -> i32 {
    minimax_ab(0, 0, is_maximizing, tree_values, depth, i32::MIN, i32::MAX)
}

fn main() {
    let scores = [3, 5, 2, 9, 12, 5, 23, 23];
    let h = (scores.len() as f64).log2() as usize;
    let result = minimax_ab(0, 0, true, &scores, h, i32::MIN, i32::MAX);
    println!("The optimal value is: {}", result);
}
