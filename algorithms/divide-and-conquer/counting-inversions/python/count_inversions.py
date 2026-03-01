def count_inversions(array: list[int]) -> int:
    def sort_and_count(values: list[int]) -> tuple[list[int], int]:
        if len(values) <= 1:
            return values[:], 0
        mid = len(values) // 2
        left, left_count = sort_and_count(values[:mid])
        right, right_count = sort_and_count(values[mid:])
        merged: list[int] = []
        count = left_count + right_count
        i = 0
        j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i])
                i += 1
            else:
                merged.append(right[j])
                count += len(left) - i
                j += 1
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, count

    return sort_and_count(array)[1]
