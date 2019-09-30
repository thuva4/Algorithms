
function FischerYatesShuffle(tbl) {
	var N = tbl.length;
	for (var i = 1; i < N; i++) {
		var j = Math.floor(Math.random()*i);
		var tmp = tbl[i];
		tbl[i] = tbl[j];
		tbl[j] = tmp;
	}
}


tbl = [];
for (var i = 0; i < 20; i++) {
	tbl[tbl.length] = i + 1;
}
console.log("Initial array:");
console.log(tbl);
FischerYatesShuffle(tbl);
console.log("Shuffled array:");
console.log(tbl);