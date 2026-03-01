use std::collections::HashMap;

struct Node {
    key: i32,
    value: i32,
    prev: usize,
    next: usize,
}

struct LruCacheImpl {
    nodes: Vec<Node>,
    map: HashMap<i32, usize>,
    head: usize,
    tail: usize,
    capacity: usize,
}

impl LruCacheImpl {
    fn new(capacity: usize) -> Self {
        let mut nodes = Vec::new();
        nodes.push(Node { key: 0, value: 0, prev: 0, next: 1 }); // head sentinel
        nodes.push(Node { key: 0, value: 0, prev: 0, next: 1 }); // tail sentinel
        LruCacheImpl {
            nodes,
            map: HashMap::new(),
            head: 0,
            tail: 1,
            capacity,
        }
    }

    fn remove_node(&mut self, idx: usize) {
        let prev = self.nodes[idx].prev;
        let next = self.nodes[idx].next;
        self.nodes[prev].next = next;
        self.nodes[next].prev = prev;
    }

    fn add_to_head(&mut self, idx: usize) {
        let head_next = self.nodes[self.head].next;
        self.nodes[idx].next = head_next;
        self.nodes[idx].prev = self.head;
        self.nodes[head_next].prev = idx;
        self.nodes[self.head].next = idx;
    }

    fn get(&mut self, key: i32) -> i32 {
        if let Some(&idx) = self.map.get(&key) {
            self.remove_node(idx);
            self.add_to_head(idx);
            self.nodes[idx].value
        } else {
            -1
        }
    }

    fn put(&mut self, key: i32, value: i32) {
        if let Some(&idx) = self.map.get(&key) {
            self.nodes[idx].value = value;
            self.remove_node(idx);
            self.add_to_head(idx);
        } else {
            if self.map.len() == self.capacity {
                let lru_idx = self.nodes[self.tail].prev;
                let lru_key = self.nodes[lru_idx].key;
                self.remove_node(lru_idx);
                self.map.remove(&lru_key);
                // Reuse the node
                self.nodes[lru_idx].key = key;
                self.nodes[lru_idx].value = value;
                self.map.insert(key, lru_idx);
                self.add_to_head(lru_idx);
            } else {
                let idx = self.nodes.len();
                self.nodes.push(Node { key, value, prev: 0, next: 0 });
                self.map.insert(key, idx);
                self.add_to_head(idx);
            }
        }
    }
}

pub fn lru_cache(operations: &[i32]) -> i32 {
    let capacity = operations[0] as usize;
    let op_count = operations[1] as usize;
    let mut cache = LruCacheImpl::new(capacity);
    let mut result_sum: i32 = 0;
    let mut idx = 2;

    for _ in 0..op_count {
        let op_type = operations[idx];
        let key = operations[idx + 1];
        let value = operations[idx + 2];
        idx += 3;

        if op_type == 1 {
            cache.put(key, value);
        } else if op_type == 2 {
            result_sum += cache.get(key);
        }
    }

    result_sum
}
