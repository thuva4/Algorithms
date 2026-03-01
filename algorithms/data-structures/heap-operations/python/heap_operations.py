def heap_sort_via_extract(arr: list[int]) -> list[int]:
    heap: list[int] = []

    def sift_up(i: int) -> None:
        while i > 0:
            parent = (i - 1) // 2
            if heap[i] < heap[parent]:
                heap[i], heap[parent] = heap[parent], heap[i]
                i = parent
            else:
                break

    def sift_down(i: int, size: int) -> None:
        while True:
            smallest = i
            left = 2 * i + 1
            right = 2 * i + 2
            if left < size and heap[left] < heap[smallest]:
                smallest = left
            if right < size and heap[right] < heap[smallest]:
                smallest = right
            if smallest != i:
                heap[i], heap[smallest] = heap[smallest], heap[i]
                i = smallest
            else:
                break

    for val in arr:
        heap.append(val)
        sift_up(len(heap) - 1)

    result: list[int] = []
    size = len(heap)
    for _ in range(size):
        result.append(heap[0])
        heap[0] = heap[len(heap) - 1]
        heap.pop()
        if heap:
            sift_down(0, len(heap))

    return result
