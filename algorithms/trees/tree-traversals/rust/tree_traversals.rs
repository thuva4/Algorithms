fn inorder_helper(arr: &[i32], i: usize, result: &mut Vec<i32>) {
    if i >= arr.len() || arr[i] == -1 { return; }
    inorder_helper(arr, 2 * i + 1, result);
    result.push(arr[i]);
    inorder_helper(arr, 2 * i + 2, result);
}

pub fn tree_traversals(arr: &[i32]) -> Vec<i32> {
    let mut result = Vec::new();
    inorder_helper(arr, 0, &mut result);
    result
}
