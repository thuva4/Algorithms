const unaryCoding = (number) => {
  return Array(number+1).join('1')+'0';
};

module.exports = {unaryCoding};
