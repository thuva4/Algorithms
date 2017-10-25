#!/usr/bin/env python3

'''
Python Implementation of Quick Select
input : array of values, n (index @ which value is required)
output : Value of element at nth index of array
'''


def QuickSelect(arr, n):
	print(arr, n)
	pivot = arr[0]
	left = [x for x in arr[1:] if x < pivot]
	right = [x for x in arr[1:] if x >= pivot]

	index_of_pivot = len(left)

	if n < index_of_pivot:
		return QuickSelect(left, n)
	elif n > index_of_pivot:
		return QuickSelect(right, n - index_of_pivot - 1)
	else:
		return pivot


def run_tests():
	array, index = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 3
	print(bool(QuickSelect(array, index), sorted(array)[index] ))

	array, index = [0, 8, 7, 5, 2, 3, 5], 5
	print(bool(QuickSelect(array, index), sorted(array)[index] ))

	array, index = [36, 8, 7, 5, 2, 3, 5], 5
	print(bool( QuickSelect(array, index), sorted(array)[index] ))
