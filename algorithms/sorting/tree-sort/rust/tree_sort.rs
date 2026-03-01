struct Node {
    val: i32,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

impl Node {
    fn new(val: i32) -> Self {
        Node {
            val,
            left: None,
            right: None,
        }
    }

    fn insert(&mut self, val: i32) {
        if val < self.val {
            match self.left {
                Some(ref mut left) => left.insert(val),
                None => self.left = Some(Box::new(Node::new(val))),
            }
        } else {
            match self.right {
                Some(ref mut right) => right.insert(val),
                None => self.right = Some(Box::new(Node::new(val))),
            }
        }
    }
}

fn store_sorted(node: &Node, arr: &mut [i32], idx: &mut usize) {
    if let Some(ref left) = node.left {
        store_sorted(left, arr, idx);
    }
    
    arr[*idx] = node.val;
    *idx += 1;
    
    if let Some(ref right) = node.right {
        store_sorted(right, arr, idx);
    }
}

pub fn tree_sort(arr: &mut [i32]) {
    if arr.is_empty() {
        return;
    }

    let mut root = Node::new(arr[0]);
    for &val in arr.iter().skip(1) {
        root.insert(val);
    }

    let mut idx = 0;
    store_sorted(&root, arr, &mut idx);
}
