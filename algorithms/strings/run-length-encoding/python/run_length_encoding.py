def run_length_encoding(arr: list[int]) -> list[int]:
    if not arr:
        return []
    result = []
    count = 1
    for i in range(1, len(arr)):
        if arr[i] == arr[i - 1]:
            count += 1
        else:
            result.extend([arr[i - 1], count])
            count = 1
    result.extend([arr[-1], count])
    return result
