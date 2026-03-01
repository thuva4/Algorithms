fun tokenize(text: String, delimiter: String): List<String> {
    if (text.isEmpty()) {
        return emptyList()
    }
    return text.split(delimiter).filter { it.isNotEmpty() }
}
