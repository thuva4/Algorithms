export function suffixArray(arr: number[]): number[] {
    const n = arr.length;
    if (n === 0) return [];
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
            const p0 = r[sa[i - 1]], c0 = r[sa[i]];
            const p1 = sa[i - 1] + step < n ? r[sa[i - 1] + step] : -1;
            const c1 = sa[i] + step < n ? r[sa[i] + step] : -1;
            if (p0 !== c0 || p1 !== c1) tmp[sa[i]]++;
        }
        rank = [...tmp];
        if (rank[sa[n - 1]] === n - 1) break;
    }
    return sa;
}
