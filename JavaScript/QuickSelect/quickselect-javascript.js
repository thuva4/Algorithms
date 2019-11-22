//Source: https://stackoverflow.com/questions/38988384/quickselect-into-javascript
	function swap(array, idxA, idxB) {
		let temp = array[idxA] 
		array[idxA] = array[idxB]
		array[idxB] = temp
	}

	function partitionStart(arr, left, right) {  
	  let pivotIdx = Math.floor(Math.random() * (right - left + 1)) + left;
	  let storeIdx = left, pivotVal = arr[pivotIdx]      
	  for (let i = left; i <= right; i++) {
	    if (arr[i] < pivotVal) {
	      swap(arr, storeIdx, i)
	      storeIdx++
	    }
	  }  
	  return storeIdx;
	}

	function quickSelectLoop(arr, k) {  
	  let pivotDist;   
	  let left = 0, right = arr.length - 1;  
	  while(right !== left) {      	
	    pivotDist = partitionStart(arr, left, right)        

	    if (k < pivotDist) {
	      right = pivotDist - 1;
	    } else {
	      left = pivotDist;
	    }
	  }    
	  return arr[k]
	}
	
	//Test


	let test2 = [87,32,55,23,389,123,555,657,12378, 12312,3332]
	let tmp = [].concat(test2)

	tmp.sort(function(a,b) { return a==b ? 0: (a< b? -1: 1)});

	for(let x=0;x<test2.length;x++) {
		console.log(quickSelectLoop([].concat(test2), x), tmp[x])    
	}