export function boyerMooreSearch(arr: number[]): number {
    const textLen = arr[0];
    const patLen = arr[1 + textLen];

    if (patLen === 0) return 0;
    if (patLen > textLen) return -1;

    const text = arr.slice(1, 1 + textLen);
    const pattern = arr.slice(2 + textLen, 2 + textLen + patLen);

    const badChar = new Map<number, number>();
    for (let i = 0; i < patLen; i++) {
        badChar.set(pattern[i], i);
    }

    let s = 0;
    while (s <= textLen - patLen) {
        let j = patLen - 1;
        while (j >= 0 && pattern[j] === text[s + j]) j--;
        if (j < 0) return s;
        const bc = badChar.get(text[s + j]) ?? -1;
        let shift = j - bc;
        if (shift < 1) shift = 1;
        s += shift;
    }

    return -1;
}
