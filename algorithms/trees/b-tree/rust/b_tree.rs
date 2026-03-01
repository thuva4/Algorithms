const T: usize = 3;
const MAX_KEYS: usize = 2 * T - 1;

struct BTreeNode {
    keys: Vec<i32>,
    children: Vec<BTreeNode>,
    leaf: bool,
}

impl BTreeNode {
    fn new(leaf: bool) -> Self {
        BTreeNode {
            keys: Vec::new(),
            children: Vec::new(),
            leaf,
        }
    }
}

fn split_child(parent: &mut BTreeNode, i: usize) {
    let full = &mut parent.children[i];
    let mut new_node = BTreeNode::new(full.leaf);
    new_node.keys = full.keys.split_off(T);
    let median = full.keys.pop().unwrap();
    if !full.leaf {
        new_node.children = full.children.split_off(T);
    }
    parent.keys.insert(i, median);
    parent.children.insert(i + 1, new_node);
}

fn insert_non_full(node: &mut BTreeNode, key: i32) {
    if node.leaf {
        let pos = node.keys.iter().position(|&k| k > key).unwrap_or(node.keys.len());
        node.keys.insert(pos, key);
    } else {
        let mut i = node.keys.len();
        while i > 0 && key < node.keys[i - 1] {
            i -= 1;
        }
        if node.children[i].keys.len() == MAX_KEYS {
            split_child(node, i);
            if key > node.keys[i] {
                i += 1;
            }
        }
        insert_non_full(&mut node.children[i], key);
    }
}

fn inorder(node: &BTreeNode, result: &mut Vec<i32>) {
    for i in 0..node.keys.len() {
        if !node.leaf {
            inorder(&node.children[i], result);
        }
        result.push(node.keys[i]);
    }
    if !node.leaf {
        inorder(&node.children[node.keys.len()], result);
    }
}

pub fn b_tree(arr: &[i32]) -> Vec<i32> {
    if arr.is_empty() {
        return vec![];
    }
    let mut root = BTreeNode::new(true);
    for &val in arr {
        if root.keys.len() == MAX_KEYS {
            let mut new_root = BTreeNode::new(false);
            let old_root = std::mem::replace(&mut root, BTreeNode::new(true));
            new_root.children.push(old_root);
            split_child(&mut new_root, 0);
            root = new_root;
        }
        insert_non_full(&mut root, val);
    }
    let mut result = Vec::new();
    inorder(&root, &mut result);
    result
}
