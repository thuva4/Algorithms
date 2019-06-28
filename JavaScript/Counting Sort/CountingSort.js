function counting_sort(array) {
	var high = highest_element(array);
	var aux_array = new Array(high-1);
	var final_array = new Array(array.length);
	for(var i = 0; i < aux_array.length; i++) {
		aux_array[i] = 0;
	}
	for(var j = 0; j < aux_array.length; j++) {
		aux_array[array[j]] = aux_array[array[j]-1] + 1;
	}
	for(var i = 1; i<high; i++) {
		aux_array[i] = aux_array[i] + aux_array[i-1];
	}
	for(var j = array.length; j>0; j-- ) {
		final_array[aux_array[array[j]-1]-1] = array[j];
		aux_array[array[j]]--;
	}
}

function highest_element(array) {
	var high = 0;
	for(var i in array) {
		if(array[i] > high)
			high = array[i];
	}
	return high;
}