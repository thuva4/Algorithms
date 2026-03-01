class FibNode:
    def __init__(self, key):
        self.key = key
        self.degree = 0
        self.parent = None
        self.child = None
        self.left = self
        self.right = self
        self.mark = False


class FibHeap:
    def __init__(self):
        self.min_node = None
        self.n = 0

    def insert(self, key):
        node = FibNode(key)
        if self.min_node is None:
            self.min_node = node
        else:
            self._add_to_root_list(node)
            if node.key < self.min_node.key:
                self.min_node = node
        self.n += 1

    def extract_min(self):
        z = self.min_node
        if z is None:
            return -1
        if z.child is not None:
            children = self._get_siblings(z.child)
            for c in children:
                self._add_to_root_list(c)
                c.parent = None
        self._remove_from_list(z)
        if z == z.right:
            self.min_node = None
        else:
            self.min_node = z.right
            self._consolidate()
        self.n -= 1
        return z.key

    def _add_to_root_list(self, node):
        node.left = self.min_node
        node.right = self.min_node.right
        self.min_node.right.left = node
        self.min_node.right = node

    def _remove_from_list(self, node):
        node.left.right = node.right
        node.right.left = node.left

    def _get_siblings(self, node):
        siblings = []
        curr = node
        while True:
            siblings.append(curr)
            curr = curr.right
            if curr == node:
                break
        return siblings

    def _consolidate(self):
        import math
        max_degree = int(math.log2(self.n)) + 2 if self.n > 0 else 1
        A = [None] * (max_degree + 1)
        roots = self._get_siblings(self.min_node)
        for w in roots:
            x = w
            d = x.degree
            while d < len(A) and A[d] is not None:
                y = A[d]
                if x.key > y.key:
                    x, y = y, x
                self._link(y, x)
                A[d] = None
                d += 1
            if d >= len(A):
                A.extend([None] * (d - len(A) + 1))
            A[d] = x
        self.min_node = None
        for node in A:
            if node is not None:
                node.left = node
                node.right = node
                if self.min_node is None:
                    self.min_node = node
                else:
                    self._add_to_root_list(node)
                    if node.key < self.min_node.key:
                        self.min_node = node

    def _link(self, y, x):
        self._remove_from_list(y)
        y.left = y
        y.right = y
        if x.child is None:
            x.child = y
        else:
            y.left = x.child
            y.right = x.child.right
            x.child.right.left = y
            x.child.right = y
        y.parent = x
        x.degree += 1
        y.mark = False


def fibonacci_heap(operations):
    heap = FibHeap()
    results = []
    for op in operations:
        if op == 0:
            results.append(heap.extract_min())
        else:
            heap.insert(op)
    return results


if __name__ == "__main__":
    print(fibonacci_heap([3, 1, 4, 0, 0]))
    print(fibonacci_heap([5, 2, 8, 1, 0, 0, 0, 0]))
