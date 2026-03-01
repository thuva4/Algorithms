def exponential_search(arr, target):
    n = len(arr)
    if n == 0:
        return -1
    if arr[0] == target:
        return 0
        
    i = 1
    while i < n and arr[i] <= target:
        i = i * 2
        
    return binary_search(arr, i // 2, min(i, n - 1), target)

def binary_search(arr, l, r, target):
    while l <= r:
        mid = l + (r - l) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1
