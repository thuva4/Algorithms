

function counting_sort(your_array){
  aux = [];
  min = -1;
  max = -1;//initial values

  for(let x of your_array) {
    max = x>max? x: max; //Find the max value and set it to the variable
    min = x<min? x: min;//Find the min value and set it to the variable
  }

  for(let z = min ; z<= max ; z++)
    aux[z] = 0;              //We need to set the objects in aux to zero

  for(let z of your_array)    //Just add one in the position for every integer inside
      aux[z]++;               //your_array counting_sort core.


  //Now iterate for every value inside aux and we'll be ready!
  answer = []
  for (let i = min; i<= max ; i++){
    for(let j = 0; j< aux[i]; j++){ //as many times saved before
      answer.push(i);
    }
  }
  return answer; //;)
}

example = [2, 10, 4 , 7 , 9, 1 , -4, 7, 2]
console.log("input: ", example)
console.log("output:", counting_sort(example)) //Be aware there are many more efficients
                                    //sorting algorithms than these. This
                                    // would be very bad when range [min, max]
                                    // is very big
