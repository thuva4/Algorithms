pub fn tokenize(text: &str, delimiter: &str) -> Vec<String> {
    if text.is_empty() {
        return Vec::new();
    }
    if delimiter.is_empty() {
        return vec![text.to_string()];
    }

    text.split(delimiter)
        .filter(|token| !token.is_empty())
        .map(|token| token.to_string())
        .collect()
}
