
function FischerYatesShuffle(tbl) {
	let N = tbl.length;
	for (let i = 1; i < N; i++) {
		let j = Math.floor(Math.random()*i);
		let tmp = tbl[i];
		tbl[i] = tbl[j];
		tbl[j] = tmp;
	}
}


tbl = [];
for (let i = 0; i < 20; i++) {
	tbl[tbl.length] = i + 1;
}
console.log("Initial array:");
console.log(tbl);
FischerYatesShuffle(tbl);
console.log("Shuffled array:");
console.log(tbl);