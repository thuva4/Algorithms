const permutations = (charList) => {
  if (charList.length === 1) {
    return charList;
  }
  const resultArray = [];
  for (let i=0; i<charList.length; i++) {
    const first = charList[i];
    let array;
    if (i<charList.length-1) {
      array = charList.slice(0, i).concat(charList.slice(i+1, charList.length));
    } else {
      array = charList.slice(0, i);
    }
    permutations(array).map( (a)=> resultArray.push([first].concat(a)));
  }
  return resultArray;
};

permutations([1, 2, 3]);
