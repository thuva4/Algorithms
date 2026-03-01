use std::collections::HashMap;

struct TrieNode {
    children: HashMap<u8, TrieNode>,
    is_end: bool,
}

impl TrieNode {
    fn new() -> Self {
        TrieNode {
            children: HashMap::new(),
            is_end: false,
        }
    }
}

fn insert(root: &mut TrieNode, key: i32) {
    let s = key.to_string();
    let mut node = root;
    for &ch in s.as_bytes() {
        node = node.children.entry(ch).or_insert_with(TrieNode::new);
    }
    node.is_end = true;
}

fn search(root: &TrieNode, key: i32) -> bool {
    let s = key.to_string();
    let mut node = root;
    for &ch in s.as_bytes() {
        match node.children.get(&ch) {
            Some(child) => node = child,
            None => return false,
        }
    }
    node.is_end
}

pub fn trie_insert_search(arr: &[i32]) -> i32 {
    let n = arr.len();
    let mid = n / 2;
    let mut root = TrieNode::new();

    for i in 0..mid {
        insert(&mut root, arr[i]);
    }

    let mut count = 0;
    for i in mid..n {
        if search(&root, arr[i]) {
            count += 1;
        }
    }

    count
}
