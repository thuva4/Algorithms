package com.dev.namhoai.sort;

public class HeapSort {

    public void sort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            heapAdd(arr, i);
        }

        for (int i = arr.length - 1; i > 0; i--) {
            swap(arr, 0, i);
            heapify(arr, i - 1);
        }
    }

    private void heapify(int[] arr, int end) {
        int i = 0;
        int leftIndex;
        int rightIndex;
        while (i <= end) {
            leftIndex = 2 * i + 1;
            if (leftIndex > end) {
                break;
            }
            rightIndex = 2 * i + 2;
            if (rightIndex > end) {
                rightIndex = leftIndex;
            }
            if (arr[i] >= Math.max(arr[leftIndex], arr[rightIndex])) {
                break;
            }
            if (arr[leftIndex] >= arr[rightIndex]) {
                swap(arr, i, leftIndex);
                i = leftIndex;
            } else {
                swap(arr, i, rightIndex);
                i = rightIndex;
            }
        }
    }

    private void swap(int[] arr, int x, int y) {
        int temp = arr[x];
        arr[x] = arr[y];
        arr[y] = temp;
    }

    private void heapAdd(int[] arr, int end) {
        int i = end;
        while (i > 0) {
            if (arr[i] > arr[(i - 1) / 2]) {
                swap(arr, i, (i - 1) / 2);
                i = (i - 1) / 2;
            } else {
                break;
            }
        }
    }

    public static void main(String[] args) {
        HeapSort hs = new HeapSort();
        int[] arr = {-1, 5, 8, 2, -6, -8, 11, 5};
        hs.sort(arr);
        for (int a : arr) {
            System.out.println(a);
        }
    }
}
