use std::cell::Cell;

fn merge_sort<T: PartialOrd + Clone>(to_sort: &[T]) -> Vec<T> {
    match to_sort.len() {
        0 => Vec::with_capacity(0),
        1 => {let mut r = Vec::with_capacity(1); r.push(to_sort[0].clone()); r}
        len => {
            let mut result = Vec::with_capacity(len);
            let pivot = len / 2;
            let (mut left, mut right) = (merge_sort(&to_sort[..pivot]).into_iter(), merge_sort(&to_sort[pivot..]).into_iter());
            let left_value = Cell::new(left.next());
            let right_value = Cell::new(right.next());
            loop {
                match (left_value.take(), right_value.take()) {
                    (Some(v), None) => {
                        result.push(v);
                        left_value.set(left.next());
                    }
                    (None, Some(v)) => {
                        result.push(v);
                        right_value.set(right.next());
                    }
                    (Some(l), Some(r)) => {
                        if l < r {
                            result.push(l);
                            left_value.set(left.next());
                            right_value.set(Some(r));
                        } else {
                            result.push(r);
                            right_value.set(right.next());
                            left_value.set(Some(l));
                        }
                    }
                    (None, None) => {return result;}
                }
            }
        }
    }
}

fn main() {
    println!("Enter a space separated list of number");
    let mut buffer = String::new();
    std::io::stdin().read_line(&mut buffer).unwrap();
    let numbers: Vec<i32> = buffer.trim().split(' ').filter_map(|x| match dbg!(x).parse() {
        Ok(val) => Some(val),
        Err(e) => {eprintln!("e: {}", e); None},
    }).collect();
    let sorted = merge_sort(dbg!(&numbers));
    println!("Sorted: {:?}", sorted);
}