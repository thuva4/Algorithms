def robin_karp_rolling_hash(arr):
    """
    Find first occurrence of pattern in text using rolling hash.

    Input: [text_len, ...text, pattern_len, ...pattern]
    Returns: index of first match, or -1
    """
    idx = 0
    tlen = arr[idx]; idx += 1
    text = arr[idx:idx + tlen]; idx += tlen
    plen = arr[idx]; idx += 1
    pattern = arr[idx:idx + plen]

    if plen > tlen:
        return -1

    BASE = 31
    MOD = 1000000007

    # Compute pattern hash and initial text window hash
    p_hash = 0
    t_hash = 0
    power = 1
    for i in range(plen):
        p_hash = (p_hash + (pattern[i] + 1) * power) % MOD
        t_hash = (t_hash + (text[i] + 1) * power) % MOD
        if i < plen - 1:
            power = (power * BASE) % MOD

    for i in range(tlen - plen + 1):
        if t_hash == p_hash:
            match = True
            for j in range(plen):
                if text[i + j] != pattern[j]:
                    match = False
                    break
            if match:
                return i

        if i < tlen - plen:
            t_hash = (t_hash - (text[i] + 1)) % MOD
            t_hash = (t_hash * pow(BASE, MOD - 2, MOD)) % MOD
            t_hash = (t_hash + (text[i + plen] + 1) * power) % MOD

    return -1


if __name__ == "__main__":
    print(robin_karp_rolling_hash([5, 1, 2, 3, 4, 5, 2, 1, 2]))   # 0
    print(robin_karp_rolling_hash([5, 1, 2, 3, 4, 5, 2, 3, 4]))   # 1
    print(robin_karp_rolling_hash([4, 1, 2, 3, 4, 2, 5, 6]))      # -1
    print(robin_karp_rolling_hash([4, 1, 2, 3, 4, 1, 4]))         # 3
