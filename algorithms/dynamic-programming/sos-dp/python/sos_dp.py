import sys

def sos_dp(n, f):
    """Compute sum over subsets for each bitmask."""
    sos = f[:]
    for i in range(n):
        for mask in range(1 << n):
            if mask & (1 << i):
                sos[mask] += sos[mask ^ (1 << i)]
    return sos


if __name__ == "__main__":
    data = sys.stdin.read().split()
    idx = 0
    n = int(data[idx]); idx += 1
    f = [int(data[idx + i]) for i in range(1 << n)]
    result = sos_dp(n, f)
    print(' '.join(map(str, result)))
