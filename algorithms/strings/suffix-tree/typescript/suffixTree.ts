export function suffixTree(arr: number[]): number {
    const n = arr.length;
    if (n === 0) return 0;

    const sa = Array.from({ length: n }, (_, i) => i);
    let rank = [...arr];
    const tmp = new Array(n);
    for (let k = 1; k < n; k *= 2) {
        const r = [...rank];
        const step = k;
        sa.sort((a, b) => {
            if (r[a] !== r[b]) return r[a] - r[b];
            const ra = a + step < n ? r[a + step] : -1;
            const rb = b + step < n ? r[b + step] : -1;
            return ra - rb;
        });
        tmp[sa[0]] = 0;
        for (let i = 1; i < n; i++) {
            tmp[sa[i]] = tmp[sa[i - 1]];
            const p0 = r[sa[i-1]], c0 = r[sa[i]];
            const p1 = sa[i-1]+step<n ? r[sa[i-1]+step] : -1;
            const c1 = sa[i]+step<n ? r[sa[i]+step] : -1;
            if (p0 !== c0 || p1 !== c1) tmp[sa[i]]++;
        }
        rank = [...tmp];
        if (rank[sa[n-1]] === n-1) break;
    }

    const invSa = new Array(n);
    const lcp = new Array(n).fill(0);
    for (let i = 0; i < n; i++) invSa[sa[i]] = i;
    let h = 0;
    for (let i = 0; i < n; i++) {
        if (invSa[i] > 0) {
            const j = sa[invSa[i]-1];
            while (i+h < n && j+h < n && arr[i+h] === arr[j+h]) h++;
            lcp[invSa[i]] = h;
            if (h > 0) h--;
        } else { h = 0; }
    }

    let total = n * (n + 1) / 2;
    for (const v of lcp) total -= v;
    return total;
}
