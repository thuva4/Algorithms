/**
Counting sort is an algorithm for sorting a collection of objects according to keys that are small integers; that is, it is an integer sorting algorithm. It operates by counting the number of objects that have each distinct key value, and using arithmetic on those counts to determine the positions of each key value in the output sequence. Its running time is linear in the number of items and the difference between the maximum and minimum key values, so it is only suitable for direct use in situations where the variation in keys is not significantly greater than the number of items.
*/

module.exports = countingSort;

function countingSort(arr, min, max) {
    var i, z = 0, count = [];
    for (i = min; i <= max; i++) {
        count[i] = 0;
    }
    for (i=0; i < arr.length; i++) {
        count[arr[i]]++;
    }
    for (i = min; i <= max; i++) {
        while (count[i]-- > 0) {
            arr[z++] = i;
        }
    }
    return arr;
}
