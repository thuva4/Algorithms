use std::cmp::max;

struct AvlNode {
    key: i32,
    left: Option<Box<AvlNode>>,
    right: Option<Box<AvlNode>>,
    height: i32,
}

impl AvlNode {
    fn new(key: i32) -> Self {
        AvlNode { key, left: None, right: None, height: 1 }
    }
}

fn height(node: &Option<Box<AvlNode>>) -> i32 {
    match node {
        Some(n) => n.height,
        None => 0,
    }
}

fn update_height(node: &mut AvlNode) {
    node.height = 1 + max(height(&node.left), height(&node.right));
}

fn balance_factor(node: &AvlNode) -> i32 {
    height(&node.left) - height(&node.right)
}

fn rotate_right(mut y: Box<AvlNode>) -> Box<AvlNode> {
    let mut x = y.left.take().unwrap();
    y.left = x.right.take();
    update_height(&mut y);
    x.right = Some(y);
    update_height(&mut x);
    x
}

fn rotate_left(mut x: Box<AvlNode>) -> Box<AvlNode> {
    let mut y = x.right.take().unwrap();
    x.right = y.left.take();
    update_height(&mut x);
    y.left = Some(x);
    update_height(&mut y);
    y
}

fn insert(node: Option<Box<AvlNode>>, key: i32) -> Box<AvlNode> {
    let mut node = match node {
        None => return Box::new(AvlNode::new(key)),
        Some(n) => n,
    };

    if key < node.key {
        node.left = Some(insert(node.left.take(), key));
    } else if key > node.key {
        node.right = Some(insert(node.right.take(), key));
    } else {
        return node;
    }

    update_height(&mut node);
    let bf = balance_factor(&node);

    if bf > 1 {
        let left_key = node.left.as_ref().unwrap().key;
        if key < left_key {
            return rotate_right(node);
        } else {
            node.left = Some(rotate_left(node.left.take().unwrap()));
            return rotate_right(node);
        }
    }
    if bf < -1 {
        let right_key = node.right.as_ref().unwrap().key;
        if key > right_key {
            return rotate_left(node);
        } else {
            node.right = Some(rotate_right(node.right.take().unwrap()));
            return rotate_left(node);
        }
    }

    node
}

fn inorder(node: &Option<Box<AvlNode>>, result: &mut Vec<i32>) {
    if let Some(n) = node {
        inorder(&n.left, result);
        result.push(n.key);
        inorder(&n.right, result);
    }
}

pub fn avl_insert_inorder(arr: &[i32]) -> Vec<i32> {
    let mut root: Option<Box<AvlNode>> = None;
    for &val in arr {
        root = Some(insert(root, val));
    }
    let mut result = Vec::new();
    inorder(&root, &mut result);
    result
}
