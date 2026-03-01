def bucket_sort(arr: list[int]) -> list[int]:
    """
    Bucket Sort implementation.
    Divides the input into several buckets, each of which is then sorted individually.
    """
    if len(arr) <= 1:
        return list(arr)

    min_val = min(arr)
    max_val = max(arr)

    # If all elements are the same
    if min_val == max_val:
        return list(arr)

    # Use n buckets for n elements
    n = len(arr)
    buckets: list[list[int]] = [[] for _ in range(n)]
    
    # Range of values
    range_val = max_val - min_val

    # Distribute elements into buckets
    for x in arr:
        # Avoid index out of bounds for max_val
        index = int((x - min_val) * (n - 1) / range_val)
        buckets[index].append(x)

    # Sort individual buckets and concatenate
    result: list[int] = []
    for bucket in buckets:
        # Using insertion sort logic within buckets
        for i in range(1, len(bucket)):
            key = bucket[i]
            j = i - 1
            while j >= 0 and bucket[j] > key:
                bucket[j + 1] = bucket[j]
                j -= 1
            bucket[j + 1] = key
        result.extend(bucket)

    return result
