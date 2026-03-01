fun bitapSearch(text: String, pattern: String): Int {
    if (pattern.isEmpty()) {
        return 0
    }
    return text.indexOf(pattern)
}
