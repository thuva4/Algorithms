const {dow, dowS} = require('../index');

describe('DoomsDay', () => {
  it('return day for the week for given date', () => {
    expect(dow(1886, 5, 1)).toEqual(6); // 6: Saturday
    expect(dow(1948, 12, 10)).toEqual(5); // 5: Friday
    expect(dow(2001, 1, 15)).toEqual(1); // 1: Monday
    expect(dow(2017, 10, 10)).toEqual(2); // 2: Tuesday
  });

  it('return day name for the week for given date', () => {
    expect(dowS(1886, 5, 1)).toEqual('Saturday');
    expect(dowS(1948, 12, 10)).toEqual('Friday');
    expect(dowS(2001, 1, 15)).toEqual('Monday');
    expect(dowS(2017, 10, 10)).toEqual('Tuesday');
  });
});
