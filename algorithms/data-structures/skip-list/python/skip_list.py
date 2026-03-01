import random

def skip_list(arr: list[int]) -> list[int]:
    MAX_LEVEL = 16

    class Node:
        def __init__(self, key, level):
            self.key = key
            self.forward = [None] * (level + 1)

    level = 0
    header = Node(-1, MAX_LEVEL)

    def random_level():
        lvl = 0
        while random.random() < 0.5 and lvl < MAX_LEVEL:
            lvl += 1
        return lvl

    def insert(key):
        nonlocal level
        update = [None] * (MAX_LEVEL + 1)
        current = header
        for i in range(level, -1, -1):
            while current.forward[i] and current.forward[i].key < key:
                current = current.forward[i]
            update[i] = current
        current = current.forward[0]
        if current and current.key == key:
            return
        new_level = random_level()
        if new_level > level:
            for i in range(level + 1, new_level + 1):
                update[i] = header
            level = new_level
        new_node = Node(key, new_level)
        for i in range(new_level + 1):
            new_node.forward[i] = update[i].forward[i]
            update[i].forward[i] = new_node

    for val in arr:
        insert(val)

    result = []
    node = header.forward[0]
    while node:
        result.append(node.key)
        node = node.forward[0]
    return result
