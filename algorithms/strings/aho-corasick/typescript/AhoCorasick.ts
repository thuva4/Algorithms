class AhoCorasickNode {
    children: Map<string, number> = new Map();
    fail: number = 0;
    output: number[] = [];
}

class AhoCorasickAutomaton {
    private trie: AhoCorasickNode[] = [];
    private patterns: string[];

    constructor(patterns: string[]) {
        this.patterns = patterns;
        this.trie.push(new AhoCorasickNode());
        this.buildTrie();
        this.buildFailLinks();
    }

    private buildTrie(): void {
        for (let i = 0; i < this.patterns.length; i++) {
            let cur = 0;
            for (const c of this.patterns[i]) {
                if (!this.trie[cur].children.has(c)) {
                    this.trie[cur].children.set(c, this.trie.length);
                    this.trie.push(new AhoCorasickNode());
                }
                cur = this.trie[cur].children.get(c)!;
            }
            this.trie[cur].output.push(i);
        }
    }

    private buildFailLinks(): void {
        const queue: number[] = [];
        for (const [, child] of this.trie[0].children) {
            this.trie[child].fail = 0;
            queue.push(child);
        }

        while (queue.length > 0) {
            const u = queue.shift()!;
            for (const [c, v] of this.trie[u].children) {
                let f = this.trie[u].fail;
                while (f !== 0 && !this.trie[f].children.has(c)) {
                    f = this.trie[f].fail;
                }
                const fChild = this.trie[f].children.get(c);
                this.trie[v].fail = (fChild !== undefined && fChild !== v) ? fChild : 0;
                this.trie[v].output.push(...this.trie[this.trie[v].fail].output);
                queue.push(v);
            }
        }
    }

    search(text: string): Array<[string, number]> {
        const results: Array<[string, number]> = [];
        let cur = 0;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            while (cur !== 0 && !this.trie[cur].children.has(c)) {
                cur = this.trie[cur].fail;
            }
            const child = this.trie[cur].children.get(c);
            if (child !== undefined) cur = child;
            const output = [...this.trie[cur].output].sort((left, right) => left - right);
            for (const idx of output) {
                results.push([this.patterns[idx], i - this.patterns[idx].length + 1]);
            }
        }
        return results;
    }
}

export function ahoCorasickSearch(text: string, patterns: string[]): Array<[string, number]> {
    const ac = new AhoCorasickAutomaton(patterns);
    return ac.search(text);
}
