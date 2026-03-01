struct Node {
    key: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

impl Node {
    fn new(key: i32) -> Self {
        Node {
            key,
            left: None,
            right: None,
        }
    }
}

fn insert(root: Option<Box<Node>>, key: i32) -> Option<Box<Node>> {
    match root {
        None => Some(Box::new(Node::new(key))),
        Some(mut node) => {
            if key <= node.key {
                node.left = insert(node.left, key);
            } else {
                node.right = insert(node.right, key);
            }
            Some(node)
        }
    }
}

fn inorder(root: &Option<Box<Node>>, result: &mut Vec<i32>) {
    if let Some(node) = root {
        inorder(&node.left, result);
        result.push(node.key);
        inorder(&node.right, result);
    }
}

pub fn bst_inorder(arr: &[i32]) -> Vec<i32> {
    let mut root: Option<Box<Node>> = None;
    for &key in arr {
        root = insert(root, key);
    }

    let mut result = Vec::new();
    inorder(&root, &mut result);
    result
}
