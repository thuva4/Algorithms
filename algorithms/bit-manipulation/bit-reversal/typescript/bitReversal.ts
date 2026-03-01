export function bitReversal(n: number): number {
    let val = n >>> 0; // treat as unsigned 32-bit
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = ((result << 1) | (val & 1)) >>> 0;
        val >>>= 1;
    }
    return result;
}
