class VEB {
    u: number;
    minVal: number = -1;
    maxVal: number = -1;
    sqrtU: number = 0;
    cluster: VEB[] | null = null;
    summary: VEB | null = null;

    constructor(u: number) {
        this.u = u;
        if (u > 2) {
            this.sqrtU = Math.ceil(Math.sqrt(u));
            this.cluster = [];
            for (let i = 0; i < this.sqrtU; i++) this.cluster.push(new VEB(this.sqrtU));
            this.summary = new VEB(this.sqrtU);
        }
    }

    high(x: number): number { return Math.floor(x / this.sqrtU); }
    low(x: number): number { return x % this.sqrtU; }
    idx(h: number, l: number): number { return h * this.sqrtU + l; }

    insert(x: number): void {
        if (this.minVal === -1) { this.minVal = this.maxVal = x; return; }
        if (x < this.minVal) { const t = x; x = this.minVal; this.minVal = t; }
        if (this.u > 2) {
            const h = this.high(x), l = this.low(x);
            if (this.cluster![h].minVal === -1) this.summary!.insert(h);
            this.cluster![h].insert(l);
        }
        if (x > this.maxVal) this.maxVal = x;
    }

    member(x: number): boolean {
        if (x === this.minVal || x === this.maxVal) return true;
        if (this.u <= 2) return false;
        return this.cluster![this.high(x)].member(this.low(x));
    }

    successor(x: number): number {
        if (this.u <= 2) {
            if (x === 0 && this.maxVal === 1) return 1;
            return -1;
        }
        if (this.minVal !== -1 && x < this.minVal) return this.minVal;
        const h = this.high(x), l = this.low(x);
        if (this.cluster![h].minVal !== -1 && l < this.cluster![h].maxVal) {
            return this.idx(h, this.cluster![h].successor(l));
        }
        const sc = this.summary!.successor(h);
        if (sc === -1) return -1;
        return this.idx(sc, this.cluster![sc].minVal);
    }
}

export function vanEmdeBoasTree(data: number[]): number[] {
    const u = data[0], nOps = data[1];
    const veb = new VEB(u);
    const results: number[] = [];
    let idx = 2;
    for (let i = 0; i < nOps; i++) {
        const op = data[idx], val = data[idx + 1];
        idx += 2;
        if (op === 1) veb.insert(val);
        else if (op === 2) results.push(veb.member(val) ? 1 : 0);
        else results.push(veb.successor(val));
    }
    return results;
}

console.log(vanEmdeBoasTree([16, 4, 1, 3, 1, 5, 2, 3, 2, 7]));
console.log(vanEmdeBoasTree([16, 6, 1, 1, 1, 4, 1, 9, 2, 4, 3, 4, 3, 9]));
