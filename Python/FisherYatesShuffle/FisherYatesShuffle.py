import random


def FischerYatesShuffle(arr):
    """
    Shuffle an array using Fischer Yates algorithm
    [https://en.wikipedia.org/wiki/Fisher-Yates_shuffle]

    :param arr:
    :return: shuffled array
    """

    for i in range(0, len(arr)):
        j = random.randrange(0, i + 1)
        tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp

    return arr


testArr = [i ** 2 for i in range(20)]

print("Initial array: ")
print(testArr)

testArr = FischerYatesShuffle(testArr)
print("Shuffled array: ")
print(testArr)
