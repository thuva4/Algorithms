use std::collections::HashMap;

pub fn boyer_moore_search(arr: &[i32]) -> i32 {
    let text_len = arr[0] as usize;
    let pat_len = arr[1 + text_len] as usize;

    if pat_len == 0 { return 0; }
    if pat_len > text_len { return -1; }

    let text = &arr[1..1 + text_len];
    let pattern = &arr[2 + text_len..2 + text_len + pat_len];

    let mut bad_char = HashMap::new();
    for (i, &v) in pattern.iter().enumerate() {
        bad_char.insert(v, i as i32);
    }

    let mut s: usize = 0;
    while s <= text_len - pat_len {
        let mut j = pat_len as isize - 1;
        while j >= 0 && pattern[j as usize] == text[s + j as usize] {
            j -= 1;
        }
        if j < 0 { return s as i32; }
        let bc = *bad_char.get(&text[s + j as usize]).unwrap_or(&-1);
        let mut shift = j as i32 - bc;
        if shift < 1 { shift = 1; }
        s += shift as usize;
    }

    -1
}
