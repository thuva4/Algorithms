type Link = Option<Box<SNode>>;

struct SNode {
    key: i32,
    left: Link,
    right: Link,
}

impl SNode {
    fn new(key: i32) -> Self {
        SNode { key, left: None, right: None }
    }
}

fn right_rotate(mut x: Box<SNode>) -> Box<SNode> {
    let mut y = x.left.take().unwrap();
    x.left = y.right.take();
    y.right = Some(x);
    y
}

fn left_rotate(mut x: Box<SNode>) -> Box<SNode> {
    let mut y = x.right.take().unwrap();
    x.right = y.left.take();
    y.left = Some(x);
    y
}

fn splay_op(root: Link, key: i32) -> Link {
    let mut root = match root {
        None => return None,
        Some(r) => r,
    };
    if root.key == key {
        return Some(root);
    }
    if key < root.key {
        if root.left.is_none() {
            return Some(root);
        }
        let mut left = root.left.take().unwrap();
        if key < left.key {
            left.left = splay_op(left.left.take(), key);
            root.left = Some(left);
            root = right_rotate(root);
        } else if key > left.key {
            left.right = splay_op(left.right.take(), key);
            if left.right.is_some() {
                let rotated = left_rotate(left);
                root.left = Some(rotated);
            } else {
                root.left = Some(left);
            }
        } else {
            root.left = Some(left);
        }
        if root.left.is_some() {
            Some(right_rotate(root))
        } else {
            Some(root)
        }
    } else {
        if root.right.is_none() {
            return Some(root);
        }
        let mut right = root.right.take().unwrap();
        if key > right.key {
            right.right = splay_op(right.right.take(), key);
            root.right = Some(right);
            root = left_rotate(root);
        } else if key < right.key {
            right.left = splay_op(right.left.take(), key);
            if right.left.is_some() {
                let rotated = right_rotate(right);
                root.right = Some(rotated);
            } else {
                root.right = Some(right);
            }
        } else {
            root.right = Some(right);
        }
        if root.right.is_some() {
            Some(left_rotate(root))
        } else {
            Some(root)
        }
    }
}

fn insert_node(root: Link, key: i32) -> Box<SNode> {
    match root {
        None => Box::new(SNode::new(key)),
        Some(r) => {
            let mut r = splay_op(Some(r), key).unwrap();
            if r.key == key {
                return r;
            }
            let mut node = Box::new(SNode::new(key));
            if key < r.key {
                node.left = r.left.take();
                node.right = Some(r);
            } else {
                node.right = r.right.take();
                node.left = Some(r);
            }
            node
        }
    }
}

fn inorder(node: &Link, result: &mut Vec<i32>) {
    if let Some(ref n) = node {
        inorder(&n.left, result);
        result.push(n.key);
        inorder(&n.right, result);
    }
}

pub fn splay_tree(arr: &[i32]) -> Vec<i32> {
    let mut root: Link = None;
    for &val in arr {
        root = Some(insert_node(root, val));
    }
    let mut result = Vec::new();
    inorder(&root, &mut result);
    result
}
