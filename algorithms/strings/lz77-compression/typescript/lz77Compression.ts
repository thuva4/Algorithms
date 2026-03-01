export function lz77Compression(arr: number[]): number {
    const n = arr.length; let count = 0, i = 0;
    while (i < n) {
        let bestLen = 0; const start = Math.max(0, i - 256);
        for (let j = start; j < i; j++) {
            let len = 0; const dist = i - j;
            while (i+len < n && len < dist && arr[j+len] === arr[i+len]) len++;
            if (len === dist) while (i+len < n && arr[j+(len%dist)] === arr[i+len]) len++;
            if (len > bestLen) bestLen = len;
        }
        if (bestLen >= 2) { count++; i += bestLen; } else i++;
    }
    return count;
}

console.log(lz77Compression([1,2,3,1,2,3]));
console.log(lz77Compression([5,5,5,5]));
console.log(lz77Compression([1,2,3,4]));
console.log(lz77Compression([1,2,1,2,3,4,3,4]));
