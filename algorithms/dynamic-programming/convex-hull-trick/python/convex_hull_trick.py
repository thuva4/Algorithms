import sys


def convex_hull_trick(lines, queries):
    return [min(m * x + b for m, b in lines) for x in queries]


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    lines = []
    for i in range(n):
        m = int(data[idx]); idx += 1
        b = int(data[idx]); idx += 1
        lines.append((m, b))
    q = int(data[idx]); idx += 1
    queries = [int(data[idx + i]) for i in range(q)]
    result = convex_hull_trick(lines, queries)
    print(' '.join(map(str, result)))
