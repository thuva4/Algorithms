/*Insertion sort is the most basic sorting algorithm out there.
* key is used to search through the given array and if there 
* is any number less than the key in the already sorted part of the 
* array it is updated accordingly and key is also updated to the next value 
* in the array.
*/

function insertionSort(arr) {
	
    for (var j=1; j<arr.length; j++) {
		var key = arr[j];
		var i = j - 1;
		while (i >= 0 && arr[i] > key) {
			arr[i+1] = arr[i];
  			i = i-1;
		}
		arr[i+1] = key;
	}

}

var ar=[3,4,5,1,6,7,8,2,0];
insertionSort(ar);

/*Output --> [0,1,2,3,4,5,6,7,8]*/
