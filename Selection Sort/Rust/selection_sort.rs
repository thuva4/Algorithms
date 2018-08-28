/*
 * Implementation of selection_sort in Rust
 */

fn selection_sort(mut list: Vec<i32>) -> Vec<i32> {
    let n = list.len();

    for j in 0..n-1 {
        let mut cur_min = j;

        for i in j+1..n {
            if list[i] < list[cur_min] {
                cur_min = i;
            }
        }

        if cur_min != j {
            list.swap(j, cur_min);
        }
    }

    return list;
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

    println!("{:?}", mylist);

    let selection_sorted = selection_sort(mylist);

    println!("{:?}", selection_sorted);
}

