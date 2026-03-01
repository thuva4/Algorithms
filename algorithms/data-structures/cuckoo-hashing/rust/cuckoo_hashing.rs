use std::collections::HashSet;

fn cuckoo_hashing(data: &[i32]) -> i32 {
    let n = data[0] as usize;
    if n == 0 {
        return 0;
    }

    let capacity = std::cmp::max(2 * n, 11) as i32;
    let cap = capacity as usize;
    let mut table1 = vec![-1i32; cap];
    let mut table2 = vec![-1i32; cap];
    let mut inserted = HashSet::new();

    let h1 = |key: i32| ((key % capacity + capacity) % capacity) as usize;
    let h2 = |key: i32| (((key / capacity + 1) % capacity + capacity) % capacity) as usize;

    for i in 1..=n {
        let key = data[i];
        if inserted.contains(&key) {
            continue;
        }
        if table1[h1(key)] == key || table2[h2(key)] == key {
            inserted.insert(key);
            continue;
        }

        let mut current = key;
        let mut success = false;
        for _ in 0..2 * cap {
            let pos1 = h1(current);
            if table1[pos1] == -1 {
                table1[pos1] = current;
                success = true;
                break;
            }
            std::mem::swap(&mut current, &mut table1[pos1]);

            let pos2 = h2(current);
            if table2[pos2] == -1 {
                table2[pos2] = current;
                success = true;
                break;
            }
            std::mem::swap(&mut current, &mut table2[pos2]);
        }
        if success {
            inserted.insert(key);
        }
    }
    inserted.len() as i32
}

fn main() {
    println!("{}", cuckoo_hashing(&[3, 10, 20, 30]));
    println!("{}", cuckoo_hashing(&[4, 5, 5, 5, 5]));
    println!("{}", cuckoo_hashing(&[5, 1, 2, 3, 4, 5]));
}
