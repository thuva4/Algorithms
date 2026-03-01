const TABLE_SIZE: usize = 64;

struct HashTable {
    buckets: Vec<Vec<(i32, i32)>>,
}

impl HashTable {
    fn new() -> Self {
        HashTable {
            buckets: (0..TABLE_SIZE).map(|_| Vec::new()).collect(),
        }
    }

    fn hash(key: i32) -> usize {
        (key.unsigned_abs() as usize) % TABLE_SIZE
    }

    fn put(&mut self, key: i32, value: i32) {
        let idx = Self::hash(key);
        for entry in &mut self.buckets[idx] {
            if entry.0 == key {
                entry.1 = value;
                return;
            }
        }
        self.buckets[idx].push((key, value));
    }

    fn get(&self, key: i32) -> i32 {
        let idx = Self::hash(key);
        for entry in &self.buckets[idx] {
            if entry.0 == key {
                return entry.1;
            }
        }
        -1
    }

    fn delete(&mut self, key: i32) {
        let idx = Self::hash(key);
        self.buckets[idx].retain(|entry| entry.0 != key);
    }
}

pub fn hash_table_ops(operations: &[i32]) -> i32 {
    let mut table = HashTable::new();
    let op_count = operations[0] as usize;
    let mut result_sum: i32 = 0;
    let mut idx = 1;

    for _ in 0..op_count {
        let op_type = operations[idx];
        let key = operations[idx + 1];
        let value = operations[idx + 2];
        idx += 3;

        match op_type {
            1 => table.put(key, value),
            2 => result_sum += table.get(key),
            3 => table.delete(key),
            _ => {}
        }
    }

    result_sum
}
