def boyer_moore_search(arr: list[int]) -> int:
    text_len = arr[0]
    text = arr[1:1 + text_len]
    pat_len = arr[1 + text_len]
    pattern = arr[2 + text_len:2 + text_len + pat_len]

    if pat_len == 0:
        return 0
    if pat_len > text_len:
        return -1

    bad_char = {}
    for i, val in enumerate(pattern):
        bad_char[val] = i

    s = 0
    while s <= text_len - pat_len:
        j = pat_len - 1
        while j >= 0 and pattern[j] == text[s + j]:
            j -= 1
        if j < 0:
            return s
        else:
            bc = bad_char.get(text[s + j], -1)
            shift = j - bc
            if shift < 1:
                shift = 1
            s += shift

    return -1
