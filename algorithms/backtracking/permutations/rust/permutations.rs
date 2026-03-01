fn permutations(arr: &[i32]) -> Vec<Vec<i32>> {
    let mut result = Vec::new();
    if arr.is_empty() {
        result.push(vec![]);
        return result;
    }
    let mut current = Vec::new();
    let mut remaining = arr.to_vec();
    backtrack(&mut current, &mut remaining, &mut result);
    result.sort();
    result
}

fn backtrack(current: &mut Vec<i32>, remaining: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
    if remaining.is_empty() {
        result.push(current.clone());
        return;
    }
    for i in 0..remaining.len() {
        let elem = remaining.remove(i);
        current.push(elem);
        backtrack(current, remaining, result);
        current.pop();
        remaining.insert(i, elem);
    }
}

fn main() {
    let arr = vec![1, 2, 3];
    let result = permutations(&arr);
    for perm in &result {
        println!("{:?}", perm);
    }
}
