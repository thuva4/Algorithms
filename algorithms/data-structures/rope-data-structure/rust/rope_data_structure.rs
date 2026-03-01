fn rope_data_structure(data: &[i32]) -> i32 {
    let n1 = data[0] as usize;
    let arr1 = &data[1..1 + n1];
    let pos = 1 + n1;
    let n2 = data[pos] as usize;
    let arr2 = &data[pos + 1..pos + 1 + n2];
    let query_index = data[pos + 1 + n2] as usize;

    if query_index < n1 {
        arr1[query_index]
    } else {
        arr2[query_index - n1]
    }
}

fn main() {
    println!("{}", rope_data_structure(&[3, 1, 2, 3, 2, 4, 5, 0]));
    println!("{}", rope_data_structure(&[3, 1, 2, 3, 2, 4, 5, 4]));
    println!("{}", rope_data_structure(&[3, 1, 2, 3, 2, 4, 5, 3]));
}
