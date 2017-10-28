
fn down_heap<T: Ord>(a: &mut [T], i: uint, n: uint) {
  let mut p = i;

  loop {
    let q = p;

    let left = (q << 1) + 1;
    if left < n && a[p] < a[left] {
      p = left
    }

    let right = (q << 1) + 2;
    if right < n && a[p] < a[right] {
      p = right
    }

    a.swap(q, p);

    if q == p {
      break;
    }
  }
}

fn heap_sort<T: Ord>(a: &mut [T]) {
  let len = a.len();

  for i in range(0, len / 2 + 1).rev() {
    down_heap(a, i, len);
  }

  for i in range(1, len).rev() {
    a.swap(0, i);
    down_heap(a, 0, i - 1);
  }
}

fn main() {
  let a: &mut [int] = [1, 5, 3, 2, 10, 30, 2, 5, 6];
  heap_sort(a);

  for i in a.iter() {
    print!("{} ", i);
  }
}
