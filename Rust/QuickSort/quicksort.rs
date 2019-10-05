mod sort {

    pub fn quicksort<T: Ord>(arr: &mut [T]) {
        let length = arr.len();
        quicksort_step(arr, 0, (length as isize) - 1);
    }


    fn quicksort_step<T: Ord>(arr: &mut [T], lo: isize, hi: isize) {
        if lo < hi {
            let pivot = lomuto_partiton(arr, lo, hi);
            quicksort_step(arr, lo, pivot - 1);
            quicksort_step(arr, pivot + 1, hi);
        }
    }

    fn lomuto_partiton<T: Ord>(arr: &mut [T], lo: isize, hi: isize) -> isize {
        let mut i = lo - 1;
        let mut j = lo;

        while j < hi - 1 {
            if arr[j as usize] < arr[hi as usize] {
                i = i + 1;
                arr.swap(i as usize, j as usize);
            }
            j = j + 1;
        }

        if arr[hi as usize] < arr[(i + 1) as usize] {
            arr.swap(hi as usize, (i + 1) as usize);
        }

        return i + 1;
    }
}

fn main() {
    let mut arr = [3, 7, 8, 5, 2, 1, 9, 5, 4];

    sort::quicksort(&mut arr);

    println!("{:?}", arr);
}
