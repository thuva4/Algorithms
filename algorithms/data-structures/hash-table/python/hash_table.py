class _HashTable:
    def __init__(self, size: int = 64) -> None:
        self._size = size
        self._buckets: list[list[tuple[int, int]]] = [[] for _ in range(size)]

    def _hash(self, key: int) -> int:
        return abs(key) % self._size

    def put(self, key: int, value: int) -> None:
        idx = self._hash(key)
        bucket = self._buckets[idx]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key: int) -> int:
        idx = self._hash(key)
        for k, v in self._buckets[idx]:
            if k == key:
                return v
        return -1

    def delete(self, key: int) -> None:
        idx = self._hash(key)
        bucket = self._buckets[idx]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket.pop(i)
                return


def hash_table_ops(operations: list[int]) -> int:
    table = _HashTable()
    op_count = operations[0]
    result_sum = 0
    idx = 1

    for _ in range(op_count):
        op_type = operations[idx]
        key = operations[idx + 1]
        value = operations[idx + 2]
        idx += 3

        if op_type == 1:
            table.put(key, value)
        elif op_type == 2:
            result_sum += table.get(key)
        elif op_type == 3:
            table.delete(key)

    return result_sum
