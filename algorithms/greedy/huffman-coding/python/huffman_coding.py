import heapq


def huffman_coding(frequencies: list[int]) -> int:
    if len(frequencies) <= 1:
        return 0

    heap = frequencies[:]
    heapq.heapify(heap)

    total_cost = 0
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = left + right
        total_cost += merged
        heapq.heappush(heap, merged)

    return total_cost
