const lcs = (string1, string2) => {
  if (!string1 || !string2) return 0;

  const string1Array = string1.split('');
  const string2Array = string2.split('');

  const dpArray = [];

  string1Array.forEach(() => {
    dpArray.push([]);
  });

  for (let i = 0; i< string1Array.length; i += 1) {
    for (let j = 0; j< string2Array.length; j += 1) {
      if (string1Array[i] === string2Array[j]) {
        dpArray[i][j] = 1 + (dpArray[i-1]?.[j-1] ? dpArray[i-1][j-1] : 0);
      } else {
        dpArray[i][j] = Math.max(
          dpArray[i-1]?.[j] ? dpArray[i-1][j] : 0,
          dpArray[i]?.[j-1] ? dpArray[i][j-1] : 0);
      }
    }
  }
  return dpArray[string1Array.length-1][string2Array.length-1];
};

module.exports = {lcs};
