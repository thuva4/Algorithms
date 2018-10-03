def bubble_sort(list):
    swaped = True
    while swaped:
        swaped = False
        for j in range(0, len(list) - 1):
            if list[j] > list[j + 1]:
                swap(list, j, j + 1)
                swaped = True

    return list


def swap(list, index_one, index_two):
    temp = list[index_one]
    list[index_one] = list[index_two]
    list[index_two] = temp

array = [1, 5, 65, 23, 57, 1232, -1, -5, -2, 242, 100,
         4, 423, 2, 564, 9, 0, 10, 43, 64, 32, 1, 999]
print(array)
bubble_sort(array)
print(array)
