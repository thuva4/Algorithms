def priority_queue_ops(arr: list[int]) -> int:
    if not arr:
        return 0

    heap: list[int] = []

    def sift_up(i: int) -> None:
        while i > 0:
            p = (i - 1) // 2
            if heap[i] < heap[p]:
                heap[i], heap[p] = heap[p], heap[i]
                i = p
            else:
                break

    def sift_down(i: int) -> None:
        size = len(heap)
        while True:
            s = i
            l, r = 2 * i + 1, 2 * i + 2
            if l < size and heap[l] < heap[s]:
                s = l
            if r < size and heap[r] < heap[s]:
                s = r
            if s != i:
                heap[i], heap[s] = heap[s], heap[i]
                i = s
            else:
                break

    def insert(val: int) -> None:
        heap.append(val)
        sift_up(len(heap) - 1)

    def extract_min() -> int:
        if not heap:
            return 0
        val = heap[0]
        heap[0] = heap[-1]
        heap.pop()
        if heap:
            sift_down(0)
        return val

    op_count = arr[0]
    idx = 1
    total = 0
    for _ in range(op_count):
        op_type = arr[idx]
        val = arr[idx + 1]
        idx += 2
        if op_type == 1:
            insert(val)
        elif op_type == 2:
            total += extract_min()

    return total
