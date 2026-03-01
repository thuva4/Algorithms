def detect_cycle(arr: list[int]) -> int:
    n = len(arr)
    if n == 0:
        return -1

    def next_pos(pos: int) -> int:
        if pos < 0 or pos >= n or arr[pos] == -1:
            return -1
        return arr[pos]

    tortoise = 0
    hare = 0

    # Phase 1: Detect cycle
    while True:
        tortoise = next_pos(tortoise)
        if tortoise == -1:
            return -1

        hare = next_pos(hare)
        if hare == -1:
            return -1
        hare = next_pos(hare)
        if hare == -1:
            return -1

        if tortoise == hare:
            break

    # Phase 2: Find cycle start
    pointer1 = 0
    pointer2 = tortoise
    while pointer1 != pointer2:
        pointer1 = arr[pointer1]
        pointer2 = arr[pointer2]

    return pointer1
