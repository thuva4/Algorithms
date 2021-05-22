
/**
 * Shuffle array in place
 * @param {Array} array
 */
function fischerYatesShuffle(array) {
	let N = array.length;
	for (let i = 1; i < N; i++) {
		let j = Math.floor(Math.random()*i);
		let tmp = array[i];
		array[i] = array[j];
		array[j] = tmp;
	}
}

module.exports = fischerYatesShuffle;