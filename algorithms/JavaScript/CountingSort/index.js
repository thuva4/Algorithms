function counting_sort(array) {
	let high = highest_element(array);
	let aux_array = new Array(high-1);
	let final_array = new Array(array.length);
	for(let i = 0; i < aux_array.length; i++) {
		aux_array[i] = 0;
	}
	for(let j = 0; j < aux_array.length; j++) {
		aux_array[array[j]] = aux_array[array[j]-1] + 1;
	}
	for(let i = 1; i<high; i++) {
		aux_array[i] = aux_array[i] + aux_array[i-1];
	}
	for(let j = array.length; j>0; j-- ) {
		final_array[aux_array[array[j]-1]-1] = array[j];
		aux_array[array[j]]--;
	}
}

function highest_element(array) {
	let high = 0;
	for(let i in array) {
		if(array[i] > high)
			high = array[i];
	}
	return high;
}