//after each iternation you have 1 number in the correct positon
//largest to smallest
//O(n2) - worst case
function selectionSortDescending(inputArray){
    for(var i = 0; i < inputArray.length - 1; i++){
      var maxIndex = i;
      for(var j = i + 1; j < inputArray.length; j++){
        if(inputArray[maxIndex] < inputArray[j]){
          maxIndex = j;//found new maximum
        }
      }

      //swap if maximum isn't the current i iteration
      if(maxIndex != i){
        var temp = inputArray[maxIndex];
        inputArray[maxIndex] = inputArray[i];
        inputArray[i] = temp;
      }
      console.log('In progress: ', inputArray);
    }
    return inputArray;
}

var input = [3,2,43,6,777,83,5,5];
console.log('Output: ', selectionSortDescending(input));
