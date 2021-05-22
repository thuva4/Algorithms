const fischerYatesShuffle = require('../index');

describe("FisherYatesShuffle", () => {
  let array;
  beforeEach(() => {
    array = [];
    for (let i = 0; i < 20; i++) {
      array.push(i + 1);
    }
  })

  it("check the effectiveness of the shuffle 90%", () => {
    let shuffle;
    let changed = 0;

    for (let i =0; i < 100; i += 1) {
      shuffle = [...array];
      fischerYatesShuffle(shuffle);
      for (let i =0; i < array.length; i++) {
        if (array[i] !== shuffle[i]) {
          changed += 1;
        }
      }
    }
    expect(changed/(100*array.length)).toBeGreaterThanOrEqual(0.9);

  });
});
