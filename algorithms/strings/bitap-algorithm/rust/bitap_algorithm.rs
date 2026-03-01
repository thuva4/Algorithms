pub fn bitap_search(text: &str, pattern: &str) -> i32 {
    if pattern.is_empty() {
        return 0;
    }

    text.find(pattern).map(|index| index as i32).unwrap_or(-1)
}
