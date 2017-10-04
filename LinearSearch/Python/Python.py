def linear_search(list, target):
    for i, num in enumerate(list):
        if num == target:
            return i

    return -1

