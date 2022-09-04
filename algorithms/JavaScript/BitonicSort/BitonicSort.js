function compAndSwap(a, i, j, dir) {
    if ((a[i] > a[j] && dir === 1) ||
        (a[i] < a[j] && dir === 0)) {
        // Swapping elements
        var temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}


function bitonicMerge(a, low, cnt, dir) {
    if (cnt > 1) {
        var k = parseInt(cnt / 2);
        for (var i = low; i < low + k; i++)
            compAndSwap(a, i, i + k, dir);
        bitonicMerge(a, low, k, dir);
        bitonicMerge(a, low + k, k, dir);
    }
}


function bitonicSort(a, low, cnt, dir) {
    if (cnt > 1) {
        var k = parseInt(cnt / 2);

        // sort in ascending order since dir here is 1
        bitonicSort(a, low, k, 1);

        // sort in descending order since dir here is 0
        bitonicSort(a, low + k, k, 0);

        // Will merge whole sequence in ascending order
        // since dir=1.
        bitonicMerge(a, low, cnt, dir);
    }
}


function sort(a, N, up) {
    bitonicSort(a, 0, N, up);
}


function printArray(arr) {
    var n = arr.length;
    for (var i = 0; i < n; ++i)
        document.write(arr[i] + " ");
    document.write("<br>");
}


var a = [3, 7, 4, 8, 6, 2, 1, 5];
var up = 1;
sort(a, a.length, up);
document.write("Sorted array: <br>");
printArray(a);