def bubble_sort(list):
    for i, num in enumerate(list):
        for j in range(0, len(list) - 1):
            if list[j] > list[j + 1]:
                swap(list, j, j + 1)

    return list


def swap(list, index_one, index_two):
    temp = list[index_one]
    list[index_one] = list[index_two]
    list[index_two] = temp

