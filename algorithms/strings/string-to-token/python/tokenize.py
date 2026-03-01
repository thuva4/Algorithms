def tokenize(string: str, delimiter: str) -> list[str]:
    if string == "":
        return []
    return string.split(delimiter)
