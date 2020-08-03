/*
 * Implementation of Linear Search in Rust
 */

fn linear_search(list: Vec<i32>, target: i32) -> Option<usize> {
    for i in 0..list.len() {
        if list[i] == target {
            return Some(i)
        }
    }
    return None;
}

fn main() {
    let mut mylist = Vec::new();
    mylist.push(5);
    mylist.push(4);
    mylist.push(8);
    mylist.push(9);
    mylist.push(20);
    mylist.push(14);
    mylist.push(3);
    mylist.push(1);
    mylist.push(2);
    mylist.push(2);

    let target = 20;

    match linear_search(mylist, target) {
        Some(r) => { print!("{}\n", r); },
        None => { print!("None found\n"); }
    };
}
