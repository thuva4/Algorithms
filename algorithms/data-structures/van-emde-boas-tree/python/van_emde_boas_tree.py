import math


class VEB:
    def __init__(self, u):
        self.u = u
        self.min_val = -1
        self.max_val = -1
        if u <= 2:
            self.cluster = None
            self.summary = None
        else:
            self.sqrt_u = int(math.ceil(math.sqrt(u)))
            self.lo_sqrt = int(math.ceil(u / self.sqrt_u))
            self.cluster = [VEB(self.sqrt_u) for _ in range(self.sqrt_u)]
            self.summary = VEB(self.sqrt_u)

    def high(self, x):
        return x // self.sqrt_u

    def low(self, x):
        return x % self.sqrt_u

    def index(self, h, l):
        return h * self.sqrt_u + l

    def insert(self, x):
        if self.min_val == -1:
            self.min_val = self.max_val = x
            return
        if x < self.min_val:
            x, self.min_val = self.min_val, x
        if self.u > 2:
            h, l = self.high(x), self.low(x)
            if self.cluster[h].min_val == -1:
                self.summary.insert(h)
            self.cluster[h].insert(l)
        if x > self.max_val:
            self.max_val = x

    def member(self, x):
        if x == self.min_val or x == self.max_val:
            return True
        if self.u <= 2:
            return False
        return self.cluster[self.high(x)].member(self.low(x))

    def successor(self, x):
        if self.u <= 2:
            if x == 0 and self.max_val == 1:
                return 1
            return -1
        if self.min_val != -1 and x < self.min_val:
            return self.min_val
        h, l = self.high(x), self.low(x)
        max_in_cluster = self.cluster[h].max_val if self.cluster[h].min_val != -1 else -1
        if max_in_cluster != -1 and l < max_in_cluster:
            offset = self.cluster[h].successor(l)
            return self.index(h, offset)
        succ_cluster = self.summary.successor(h)
        if succ_cluster == -1:
            return -1
        offset = self.cluster[succ_cluster].min_val
        return self.index(succ_cluster, offset)


def van_emde_boas_tree(data):
    u = data[0]
    n_ops = data[1]
    results = []
    veb = VEB(u)
    idx = 2
    for _ in range(n_ops):
        op = data[idx]
        val = data[idx + 1]
        idx += 2
        if op == 1:
            veb.insert(val)
        elif op == 2:
            results.append(1 if veb.member(val) else 0)
        elif op == 3:
            results.append(veb.successor(val))
    return results


if __name__ == "__main__":
    print(van_emde_boas_tree([16, 4, 1, 3, 1, 5, 2, 3, 2, 7]))
    print(van_emde_boas_tree([16, 4, 1, 2, 1, 5, 1, 10, 3, 3]))
    print(van_emde_boas_tree([16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9]))
