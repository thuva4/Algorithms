use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};

struct TreapNode {
    key: i32,
    priority: u64,
    left: Option<Box<TreapNode>>,
    right: Option<Box<TreapNode>>,
}

static mut SEED: u64 = 12345;

fn next_rand() -> u64 {
    unsafe {
        SEED ^= SEED << 13;
        SEED ^= SEED >> 7;
        SEED ^= SEED << 17;
        SEED
    }
}

impl TreapNode {
    fn new(key: i32) -> Self {
        TreapNode {
            key,
            priority: next_rand(),
            left: None,
            right: None,
        }
    }
}

fn right_rot(mut p: Box<TreapNode>) -> Box<TreapNode> {
    let mut q = p.left.take().unwrap();
    p.left = q.right.take();
    q.right = Some(p);
    q
}

fn left_rot(mut p: Box<TreapNode>) -> Box<TreapNode> {
    let mut q = p.right.take().unwrap();
    p.right = q.left.take();
    q.left = Some(p);
    q
}

fn insert_node(root: Option<Box<TreapNode>>, key: i32) -> Box<TreapNode> {
    match root {
        None => Box::new(TreapNode::new(key)),
        Some(mut node) => {
            if key < node.key {
                node.left = Some(insert_node(node.left.take(), key));
                if node.left.as_ref().unwrap().priority > node.priority {
                    node = right_rot(node);
                }
            } else if key > node.key {
                node.right = Some(insert_node(node.right.take(), key));
                if node.right.as_ref().unwrap().priority > node.priority {
                    node = left_rot(node);
                }
            }
            node
        }
    }
}

fn inorder_collect(node: &Option<Box<TreapNode>>, result: &mut Vec<i32>) {
    if let Some(ref n) = node {
        inorder_collect(&n.left, result);
        result.push(n.key);
        inorder_collect(&n.right, result);
    }
}

pub fn treap(arr: &[i32]) -> Vec<i32> {
    let mut root: Option<Box<TreapNode>> = None;
    for &val in arr {
        root = Some(insert_node(root, val));
    }
    let mut result = Vec::new();
    inorder_collect(&root, &mut result);
    result
}
