class _Node:
    __slots__ = ("key", "value", "prev", "next")

    def __init__(self, key: int = 0, value: int = 0) -> None:
        self.key = key
        self.value = value
        self.prev: "_Node | None" = None
        self.next: "_Node | None" = None


class _LRUCache:
    def __init__(self, capacity: int) -> None:
        self.capacity = capacity
        self.map: dict[int, _Node] = {}
        self.head = _Node()
        self.tail = _Node()
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: _Node) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_head(self, node: _Node) -> None:
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.map:
            node = self.map[key]
            self._remove(node)
            self._add_to_head(node)
            return node.value
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.map:
            node = self.map[key]
            node.value = value
            self._remove(node)
            self._add_to_head(node)
        else:
            if len(self.map) == self.capacity:
                lru = self.tail.prev
                self._remove(lru)
                del self.map[lru.key]
            node = _Node(key, value)
            self.map[key] = node
            self._add_to_head(node)


def lru_cache(operations: list[int]) -> int:
    capacity = operations[0]
    op_count = operations[1]
    cache = _LRUCache(capacity)
    result_sum = 0
    idx = 2

    for _ in range(op_count):
        op_type = operations[idx]
        key = operations[idx + 1]
        value = operations[idx + 2]
        idx += 3

        if op_type == 1:
            cache.put(key, value)
        elif op_type == 2:
            result_sum += cache.get(key)

    return result_sum
