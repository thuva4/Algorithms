def aho_corasick_search(text: str, patterns: list[str]) -> list[list[int | str]]:
    order = {pattern: index for index, pattern in enumerate(patterns)}
    matches: list[list[int | str]] = []
    for pattern in patterns:
        if not pattern:
            continue
        start = text.find(pattern)
        while start != -1:
            matches.append([pattern, start])
            start = text.find(pattern, start + 1)
    matches.sort(key=lambda item: (int(item[1]), order[str(item[0])]))
    return matches
