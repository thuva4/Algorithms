def josephus(n: int, k: int) -> int:
    survivor = 0
    for size in range(1, n + 1):
        survivor = (survivor + k) % size
    return survivor
