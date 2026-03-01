def stack_ops(arr: list[int]) -> int:
    if not arr:
        return 0
    stack: list[int] = []
    op_count = arr[0]
    idx = 1
    total = 0
    for _ in range(op_count):
        op_type = arr[idx]
        val = arr[idx + 1]
        idx += 2
        if op_type == 1:
            stack.append(val)
        elif op_type == 2:
            if stack:
                total += stack.pop()
            else:
                total += -1
    return total
