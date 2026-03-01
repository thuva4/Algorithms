from collections import deque

def queue_ops(arr: list[int]) -> int:
    if not arr:
        return 0
    q: deque[int] = deque()
    op_count = arr[0]
    idx = 1
    total = 0
    for _ in range(op_count):
        op_type = arr[idx]
        val = arr[idx + 1]
        idx += 2
        if op_type == 1:
            q.append(val)
        elif op_type == 2:
            if q:
                total += q.popleft()
    return total
