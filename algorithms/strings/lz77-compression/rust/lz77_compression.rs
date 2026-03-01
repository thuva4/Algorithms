pub fn lz77_compression(arr: &[i32]) -> i32 {
    let n = arr.len(); let mut count = 0i32; let mut i = 0;
    while i < n {
        let mut best_len = 0; let start = if i > 256 { i - 256 } else { 0 };
        for j in start..i {
            let mut len = 0; let dist = i - j;
            while i+len < n && len < dist && arr[j+len] == arr[i+len] { len += 1; }
            if len == dist { while i+len < n && arr[j+(len%dist)] == arr[i+len] { len += 1; } }
            if len > best_len { best_len = len; }
        }
        if best_len >= 2 { count += 1; i += best_len; } else { i += 1; }
    }
    count
}

fn main() {
    println!("{}", lz77_compression(&[1,2,3,1,2,3]));
    println!("{}", lz77_compression(&[5,5,5,5]));
    println!("{}", lz77_compression(&[1,2,3,4]));
    println!("{}", lz77_compression(&[1,2,1,2,3,4,3,4]));
}
