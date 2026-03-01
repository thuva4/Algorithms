use std::collections::HashMap;
use std::collections::VecDeque;

struct TrieNode {
    children: HashMap<u8, usize>,
    fail: usize,
    output: Vec<usize>,
}

impl TrieNode {
    fn new() -> Self {
        TrieNode {
            children: HashMap::new(),
            fail: 0,
            output: Vec::new(),
        }
    }
}

struct AhoCorasick {
    trie: Vec<TrieNode>,
    patterns: Vec<String>,
}

impl AhoCorasick {
    fn new(patterns: Vec<String>) -> Self {
        let mut ac = AhoCorasick {
            trie: vec![TrieNode::new()],
            patterns,
        };
        ac.build_trie();
        ac.build_fail_links();
        ac
    }

    fn build_trie(&mut self) {
        for i in 0..self.patterns.len() {
            let mut cur = 0;
            for &b in self.patterns[i].as_bytes() {
                let next = if let Some(&child) = self.trie[cur].children.get(&b) {
                    child
                } else {
                    let child = self.trie.len();
                    self.trie.push(TrieNode::new());
                    self.trie[cur].children.insert(b, child);
                    child
                };
                cur = next;
            }
            self.trie[cur].output.push(i);
        }
    }

    fn build_fail_links(&mut self) {
        let mut queue = VecDeque::new();
        let root_children: Vec<(u8, usize)> = self.trie[0].children.iter()
            .map(|(&k, &v)| (k, v)).collect();
        for (_, child) in root_children {
            self.trie[child].fail = 0;
            queue.push_back(child);
        }

        while let Some(u) = queue.pop_front() {
            let children: Vec<(u8, usize)> = self.trie[u].children.iter()
                .map(|(&k, &v)| (k, v)).collect();
            for (c, v) in children {
                let mut f = self.trie[u].fail;
                while f != 0 && !self.trie[f].children.contains_key(&c) {
                    f = self.trie[f].fail;
                }
                let fail_target = if let Some(&fc) = self.trie[f].children.get(&c) {
                    if fc != v { fc } else { 0 }
                } else {
                    0
                };
                self.trie[v].fail = fail_target;
                let fail_output: Vec<usize> = self.trie[fail_target].output.clone();
                self.trie[v].output.extend(fail_output);
                queue.push_back(v);
            }
        }
    }

    fn search(&self, text: &str) -> Vec<(String, usize)> {
        let mut results = Vec::new();
        let mut cur = 0;
        for (i, &b) in text.as_bytes().iter().enumerate() {
            while cur != 0 && !self.trie[cur].children.contains_key(&b) {
                cur = self.trie[cur].fail;
            }
            if let Some(&next) = self.trie[cur].children.get(&b) {
                cur = next;
            }
            for &idx in &self.trie[cur].output {
                results.push((self.patterns[idx].clone(), i + 1 - self.patterns[idx].len()));
            }
        }
        results
    }
}

pub fn aho_corasick_search(text: &str, patterns: &Vec<String>) -> Vec<(String, usize)> {
    let ac = AhoCorasick::new(patterns.clone());
    ac.search(text)
}

fn main() {
    let patterns = vec![
        "he".to_string(), "she".to_string(),
        "his".to_string(), "hers".to_string(),
    ];
    let ac = AhoCorasick::new(patterns);
    let results = ac.search("ahishers");
    for (word, index) in &results {
        println!("Word \"{}\" found at index {}", word, index);
    }
}
