def cuckoo_hashing(data):
    n = data[0]
    keys = data[1:1 + n]

    if n == 0:
        return 0

    capacity = max(2 * n, 11)
    table1 = [None] * capacity
    table2 = [None] * capacity
    inserted = set()

    def h1(key):
        return key % capacity

    def h2(key):
        return (key // capacity + 1) % capacity

    def contains(key):
        return table1[h1(key)] == key or table2[h2(key)] == key

    def insert(key):
        if contains(key):
            return True
        max_iter = 2 * capacity
        current = key
        for _ in range(max_iter):
            pos1 = h1(current)
            if table1[pos1] is None:
                table1[pos1] = current
                return True
            current, table1[pos1] = table1[pos1], current

            pos2 = h2(current)
            if table2[pos2] is None:
                table2[pos2] = current
                return True
            current, table2[pos2] = table2[pos2], current
        return False

    for key in keys:
        if key not in inserted:
            if insert(key):
                inserted.add(key)

    return len(inserted)


if __name__ == "__main__":
    print(cuckoo_hashing([3, 10, 20, 30]))
    print(cuckoo_hashing([4, 5, 5, 5, 5]))
    print(cuckoo_hashing([5, 1, 2, 3, 4, 5]))
