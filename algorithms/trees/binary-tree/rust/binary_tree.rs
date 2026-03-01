use std::collections::VecDeque;

struct TreeNode {
    val: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}

impl TreeNode {
    fn new(val: i32) -> Self {
        TreeNode { val, left: None, right: None }
    }
}

fn build_tree(arr: &[Option<i32>]) -> Option<Box<TreeNode>> {
    if arr.is_empty() || arr[0].is_none() {
        return None;
    }

    fn build_at(arr: &[Option<i32>], index: usize) -> Option<Box<TreeNode>> {
        if index >= arr.len() {
            return None;
        }
        let value = arr[index]?;
        let mut node = Box::new(TreeNode::new(value));
        node.left = build_at(arr, 2 * index + 1);
        node.right = build_at(arr, 2 * index + 2);
        Some(node)
    }

    build_at(arr, 0)
}

fn level_order_traversal(arr: &[Option<i32>]) -> Vec<i32> {
    let root = match build_tree(arr) {
        Some(r) => r,
        None => return vec![],
    };

    let mut result = Vec::new();
    let mut queue: VecDeque<&TreeNode> = VecDeque::new();
    queue.push_back(&root);

    while let Some(node) = queue.pop_front() {
        result.push(node.val);
        if let Some(ref left) = node.left {
            queue.push_back(left);
        }
        if let Some(ref right) = node.right {
            queue.push_back(right);
        }
    }
    result
}

fn main() {
    let arr = vec![Some(1), Some(2), Some(3), Some(4), Some(5), Some(6), Some(7)];
    println!("Level order: {:?}", level_order_traversal(&arr));
}
