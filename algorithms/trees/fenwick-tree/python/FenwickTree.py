class FenwickTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (self.n + 1)
        for i, v in enumerate(arr):
            self.update(i, v)

    def update(self, i, delta):
        i += 1
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)

    def query(self, i):
        s = 0
        i += 1
        while i > 0:
            s += self.tree[i]
            i -= i & (-i)
        return s


if __name__ == "__main__":
    arr = [1, 2, 3, 4, 5]
    ft = FenwickTree(arr)
    print(f"Sum of first 4 elements: {ft.query(3)}")

    ft.update(2, 5)
    print(f"After update, sum of first 4 elements: {ft.query(3)}")
